import { ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";
//@ts-ignore
import { LoggingModel } from "@schemas/Logging";
import Types from "@enums/Types";
import { EmbedBuilder } from "@discordjs/builders";

export default class Ban extends Command {
    constructor(client: any) {
        super(client, {
            name: "ban",
            description: "Permanently remove a user or bot from the server.",
            category: Category.Moderation,
            options: [
                {
                    name: "user",
                    description: "Ban a user from the server.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "User to be permanently banned.",
                            type: Types.User,
                            required: true,
                        },
                        {
                            name: "dm",
                            description: "Send a DM to the user about the ban.",
                            type: Types.Boolean,
                            required: true,
                        },
                        {
                            name: "silent",
                            description: "Do not show ban publicly but log it.",
                            type: Types.Boolean,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "The reason for banning the user.",
                            type: Types.String,
                            required: false,
                        },
                    ],
                },
                {
                    name: "bot",
                    description: "Ban a bot from the server.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "Bot to be permanently banned.",
                            type: Types.User,
                            required: true,
                        },
                        {
                            name: "silent",
                            description: "Do not show ban publicly but log it.",
                            type: Types.Boolean,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "The reason for banning the bot.",
                            type: Types.String,
                            required: false,
                        },
                    ],
                },
            ],
            DefaultMemberPermissions: PermissionsBitField.Flags.BanMembers,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({});
        const embed = new EmbedBuilder().setColor(0x242429).setTimestamp();

        const target = interaction.options.getUser("target");
        const reason =
            interaction.options.getString("reason") ||
            "No reason was provided.";
        const dm = interaction.options.getBoolean("dm") || false;
        const silent = interaction.options.getBoolean("silent") || false;

        if (
            !interaction.guild ||
            !interaction.guild.members.me ||
            !interaction.guild.members.me.permissions.has(
                PermissionsBitField.Flags.BanMembers
            )
        ) {
            embed.setDescription("I do not have permission to ban members.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!target) {
            embed.setDescription(
                "The specified target user could not be found."
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (target.id === interaction.user.id) {
            embed.setDescription("You cannot ban yourself.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (target.id === interaction.client.user.id) {
            embed.setDescription("You cannot ban this bot.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const member = await interaction.guild.members
            .fetch(target.id)
            .catch(() => null);
        if (!member || !member.bannable) {
            embed.setDescription(
                "I cannot ban this user. Check my role position and permissions."
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            if (dm) {
                embed.setDescription(
                    `You have been permanently banned from **${interaction.guild.name}**.\n\n` +
                        `**Reason:** \`${reason}\`\n\n` +
                        `If you believe this was a mistake, contact the server admins.`
                );
                await target.send({ embeds: [embed] }).catch(() => {});
            }

            await member.ban({ reason });

            embed.setDescription(
                `✅ **${target.tag}** was banned from **${interaction.guild.name}**.\n\n` +
                    `**Reason:** \`${reason}\`\n` +
                    `**Silent:** \`${silent}\``
            );
            await interaction.reply({ embeds: [embed], ephemeral: silent });

            const logEntry = new LoggingModel({
                usrTag: target.tag,
                usrName: target.username,
                usrId: target.id,
                stffTag: interaction.user.tag,
                stffName: interaction.user.username,
                stffId: interaction.user.id,
                action: "Ban",
                reason,
                silent,
                dm,
                timestamp: new Date(),
                channelId: interaction.channelId,
                gldId: interaction.guild.id,
                gldName: interaction.guild.name,
                gldIcon: interaction.guild.iconURL(),
            });
            await logEntry.save();
        } catch {
            embed.setDescription(
                "❌ An error occurred while banning this user."
            );
            await interaction.reply({ embeds: [embed] });
            setTimeout(() => interaction.deleteReply().catch(() => {}), 60000);
        }

        return;
    }
}
