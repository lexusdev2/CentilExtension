import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";
import { LoggingModel } from "@schemas/Logging";

export default class Kick extends Command {
    constructor(client: any) {
        super(client, {
            name: "kick",
            description: "Remove a member from the server.",
            category: Category.Moderation,
            options: [
                {
                    name: "user",
                    description: "Member to be removed from the server.",
                    type: ApplicationCommandOptionType.User,
                    required: true,
                },
                {
                    name: "reason",
                    description: "Reason for removing the member.",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "silent",
                    description: "Do not notify others of the action.",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false,
                },
                {
                    name: "dm",
                    description: "Send a direct message before removal.",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false,
                },
                {
                    name: "days",
                    description: "Number of message days to delete (0–7).",
                    type: ApplicationCommandOptionType.Integer,
                    required: false,
                    choices: Array.from({ length: 8 }, (_, i) => ({
                        name: i.toString(),
                        value: i,
                    })),
                },
            ],
            DefaultMemberPermissions: PermissionsBitField.Flags.KickMembers,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user");
        const reason =
            interaction.options.getString("reason") ||
            "No reason was provided.";
        const silent = interaction.options.getBoolean("silent") || false;
        const dm = interaction.options.getBoolean("dm") || false;
        const days = interaction.options.getInteger("days") ?? 0;

        const embed = new EmbedBuilder().setColor("#242429");

        if (!user) {
            embed.setDescription("❌ The specified user could not be located.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (days < 0 || days > 7) {
            embed.setDescription(
                "❌ The 'days' option must be between 0 and 7."
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const member = interaction.guild?.members.cache.get(user.id);

        if (!member) {
            embed.setDescription(
                "❌ This member is not present in the server."
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!member.kickable) {
            embed.setDescription(
                "⚠️ I cannot remove this member due to permission issues or role hierarchy."
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (dm) {
            try {
                await user.send(
                    `You have been removed from **${interaction.guild?.name}** for the following reason:\n${reason}`
                );
            } catch {}
        }

        try {
            await member.kick(reason);
        } catch {
            embed.setDescription("❌ Failed to remove the member.");
            await interaction.reply({ embeds: [embed] });
            setTimeout(() => interaction.deleteReply().catch(() => {}), 60000);
            return;
        }

        embed.setTitle("🚨 Member Removed");
        embed.setDescription(
            `**${user.tag}** has been removed from the server.`
        );
        embed.addFields({ name: "Reason", value: reason });
        embed.setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: silent });
        const reply = await interaction.fetchReply();

        await LoggingModel.create({
            userTarget: user.tag,
            userTargetId: user.id,
            action: "kick",
            moderator: interaction.user.tag,
            moderatorId: interaction.user.id,
            reason,
            timestamp: new Date(),
            guildId: interaction.guild?.id || "unknown",
            guildName: interaction.guild?.name || "unknown",
            channelId: interaction.channelId,
            channelName:
                interaction.channel?.isTextBased() &&
                "name" in interaction.channel
                    ? interaction.channel.name
                    : "unknown",
            messageId: reply.id,
        });

        return;
    }
}
