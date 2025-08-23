import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";

export default class NowPlaying extends Command {
    constructor(client: any) {
        super(client, {
            name: "nowplaying",
            description: "Displays the currently playing track.",
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

        if (!player || !player.current) {
            embed
                .setTitle("No Track Playing")
                .setDescription("❌ There is no music playing right now.");
            return interaction.editReply({ embeds: [embed] });
        }

        const track = player.current;
        const duration = track.info.length
            ? `${Math.floor(track.info.length / 60000)}:${Math.floor(
                  (track.info.length % 60000) / 1000
              )
                  .toString()
                  .padStart(2, "0")}`
            : "Live";

        const thumbnailUrl = `https://img.youtube.com/vi/${track.info.identifier}/hqdefault.jpg`;

        embed
            .setTitle("🎵 Now Playing")
            .setDescription(`[${track.info.title}](${track.info.uri})`)
            .addFields(
                {
                    name: "Channel",
                    value: track.info.author || "Unknown",
                    inline: true,
                },
                {
                    name: "Duration",
                    value: duration,
                    inline: true,
                },
                {
                    name: "Requested by",
                    value: `<@${
                        track.info.requester?.id || interaction.user.id
                    }>`,
                    inline: true,
                }
            )
            .setThumbnail(thumbnailUrl);

        return interaction.editReply({ embeds: [embed] });
    }
}
