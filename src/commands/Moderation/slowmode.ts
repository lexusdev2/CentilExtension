import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
    TextChannel,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";

export default class Slowmode extends Command {
    constructor(client: any) {
        super(client, {
            name: "slowmode",
            description:
                "Configure the slowmode duration for a specified text channel.",
            category: Category.Moderation,
            options: [
                {
                    name: "rate",
                    description:
                        "Specify the slowmode interval. Maximum duration is six hours (21,600 seconds).",
                    type: ApplicationCommandOptionType.Integer,
                    required: true,
                    choices: [
                        { name: "1s", value: 1 },
                        { name: "5s", value: 5 },
                        { name: "10s", value: 10 },
                        { name: "15s", value: 15 },
                        { name: "30s", value: 30 },
                        { name: "1m", value: 60 },
                        { name: "2m", value: 120 },
                        { name: "5m", value: 300 },
                        { name: "10m", value: 600 },
                        { name: "15m", value: 900 },
                        { name: "30m", value: 1800 },
                        { name: "1h", value: 3600 },
                        { name: "2h", value: 7200 },
                        { name: "4h", value: 14400 },
                        { name: "6h", value: 21600 },
                    ],
                },
                {
                    name: "channel",
                    description:
                        "Select the channel in which to apply the slowmode setting.",
                    type: ApplicationCommandOptionType.Channel,
                    required: false,
                },
                {
                    name: "reason",
                    description:
                        "Provide a reason for enabling slowmode (for audit logging).",
                    type: ApplicationCommandOptionType.String,
                    required: false,
                },
                {
                    name: "silent",
                    description:
                        "Determine whether the response should be hidden from others.",
                    type: ApplicationCommandOptionType.Boolean,
                    required: false,
                },
            ],
            DefaultMemberPermissions: PermissionsBitField.Flags.ManageChannels,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const rate = interaction.options.getInteger("rate");
        const channel = (interaction.options.getChannel("channel") ||
            interaction.channel) as TextChannel;
        const reason =
            interaction.options.getString("reason") ||
            "No reason was provided.";
        const silent = interaction.options.getBoolean("silent") || false;

        const embed = new EmbedBuilder().setColor(0x242429);

        if (rate === null || rate < 0 || rate > 21600) {
            embed.setDescription(
                "Please provide a valid slowmode duration between 0 and 21,600 seconds (6 hours)."
            );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            await channel.setRateLimitPerUser(rate, reason);
        } catch (error) {
            embed.setDescription(
                "❌ An error occurred while attempting to update the slowmode setting."
            );
            await interaction.reply({ embeds: [embed] });
            setTimeout(() => {
                interaction.deleteReply().catch(() => {});
            }, 60000);
            return;
        }

        embed.setDescription(
            `✅ Slowmode has been set to **${rate}** second(s) in <#${channel.id}>.`
        );
        if (reason) {
            embed.addFields({ name: "Reason", value: reason, inline: true });
        }

        return interaction.reply({ embeds: [embed], ephemeral: silent });
    }
}
