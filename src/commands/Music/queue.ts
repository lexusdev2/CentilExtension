import Command from "@classes/Command";
import Category from "@enums/Category";
import {
    PermissionsBitField,
    EmbedBuilder,
    ChatInputCommandInteraction,
} from "discord.js";

export default class Queue extends Command {
    constructor(client: any) {
        super(client, {
            name: "queue",
            description: "Displays the current music queue.",
            category: Category.Music,
            options: [],
            cooldown: 2,
            DefaultMemberPermissions: PermissionsBitField.Flags.Connect,
            dmPermission: false,
            dev: false,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const client = this.client;
        const embed = new EmbedBuilder().setColor(0x2b2d31).setTimestamp();

        await interaction.deferReply({ ephemeral: true });

        const player = client.riffy.players.get(interaction.guildId!);

        if (!player || (!player.current && player.queue.length === 0)) {
            embed
                .setTitle("Empty Queue")
                .setDescription(
                    "❌ The queue is empty. Use `/play` to add some tracks."
                );
            return interaction.editReply({ embeds: [embed] });
        }

        const current = player.current;
        const thumbnailUrl = `https://img.youtube.com/vi/${current.info.identifier}/hqdefault.jpg`;

        embed
            .setTitle("🎶 Music Queue")
            .setDescription(
                `**Now Playing:** [${current.info.title}](${current.info.uri})`
            )
            .setThumbnail(thumbnailUrl);

        if (player.queue.length > 0) {
            const queuePreview = player.queue
                .slice(0, 10)
                .map(
                    (track: any, index: number) =>
                        `\`${index + 1}.\` [${track.info.title}](${
                            track.info.uri
                        })`
                )
                .join("\n");

            embed.addFields({
                name: "Up Next",
                value: queuePreview,
            });

            if (player.queue.length > 10) {
                embed.addFields({
                    name: "And More...",
                    value: `📝 Showing first 10 of ${player.queue.length} queued tracks.`,
                });
            }
        } else {
            embed.addFields({
                name: "Up Next",
                value: "Queue is empty.",
            });
        }

        return interaction.editReply({ embeds: [embed] });
    }
}
