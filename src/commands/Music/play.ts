import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    GuildMember,
    VoiceBasedChannel,
    EmbedBuilder,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";
import Types from "@enums/Types";

export default class Play extends Command {
    constructor(client: any) {
        super(client, {
            name: "play",
            description:
                "Searches YouTube or Spotify and queues a song or playlist.",
            category: Category.Music,
            options: [
                {
                    name: "query",
                    description: "Provide a song name or URL to play music.",
                    type: Types.String,
                    required: true,
                },
            ],
            DefaultMemberPermissions: PermissionsBitField.Flags.Connect,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const query = interaction.options.getString("query", true);
        const member = interaction.member as GuildMember;
        const voiceChannel = member.voice?.channel as VoiceBasedChannel;

        const client = this.client;
        const embed = new EmbedBuilder().setColor(0x2b2d31).setTimestamp();

        await interaction.deferReply({ ephemeral: true });

        if (!voiceChannel) {
            embed.setDescription(
                "❌ You must be in a voice channel to use this command."
            );
            return interaction.editReply({ embeds: [embed] });
        }

        try {
            const player = client.riffy.createConnection({
                guildId: interaction.guildId!,
                voiceChannel: voiceChannel.id,
                textChannel: interaction.channelId,
                deaf: false,
            });

            const resolve = await client.riffy.resolve({
                query,
                requester: interaction.user,
            });

            const { loadType, tracks, playlistInfo } = resolve;

            if (!tracks.length) {
                embed.setDescription(
                    "❌ No results found. Try a different query."
                );
                return interaction.editReply({ embeds: [embed] });
            }

            // Handle playlist
            if (loadType === "playlist" && playlistInfo) {
                for (const track of tracks) {
                    track.info.requester = interaction.user;
                    player.queue.add(track);
                }

                embed
                    .setTitle("📃 Added Playlist to Queue")
                    .setDescription(
                        `[${playlistInfo.name ?? "Unknown Playlist"}](${
                            tracks[0].info.uri ?? "#"
                        })\n**Tracks:** ${tracks.length}`
                    )
                    .addFields({
                        name: "Requested by",
                        value: `<@${interaction.user.id}>`,
                        inline: false,
                    });

                if (
                    !player.playing &&
                    !player.paused &&
                    player.queue.size > 0
                ) {
                    await player.play();
                }

                return interaction.editReply({ embeds: [embed] });
            }

            // Handle single track
            const track = tracks.shift();
            if (!track) {
                embed.setDescription("❌ Failed to retrieve a playable track.");
                return interaction.editReply({ embeds: [embed] });
            }

            track.info.requester = interaction.user;
            player.queue.add(track);

            // Queue as array
            const queueArray = Array.from(player.queue || []);
            const position = queueArray.length;

            // Total duration until the new track
            const queueDuration = queueArray
                .slice(0, -1)
                .reduce((acc: number, t: any) => acc + (t.info.length || 0), 0);

            const duration = track.info.length
                ? `${Math.floor(track.info.length / 60000)}:${String(
                      Math.floor((track.info.length % 60000) / 1000)
                  ).padStart(2, "0")}`
                : "Live";

            const eta = queueDuration
                ? `${Math.floor(queueDuration / 60000)}:${String(
                      Math.floor((queueDuration % 60000) / 1000)
                  ).padStart(2, "0")}`
                : position === 1
                ? "Now"
                : "Soon";

            if (!player.playing && !player.paused && queueArray.length > 0) {
                await player.play();
            }

            const identifier = track.info.identifier;
            const thumbnailUrl = identifier
                ? `https://img.youtube.com/vi/${identifier}/hqdefault.jpg`
                : undefined;

            embed
                .setTitle("🎶 Added to Queue")
                .setDescription(
                    `[${track.info.title ?? "Unknown Track"}](${
                        track.info.uri ?? "#"
                    })`
                )
                .addFields(
                    {
                        name: "Channel",
                        value: track.info.author ?? "Unknown",
                        inline: true,
                    },
                    {
                        name: "Song Duration",
                        value: duration,
                        inline: true,
                    },
                    {
                        name: "Estimated time until playing",
                        value: eta,
                        inline: true,
                    },
                    {
                        name: "Position in queue",
                        value: `${position}`,
                        inline: true,
                    }
                );

            if (thumbnailUrl) {
                embed.setThumbnail(thumbnailUrl);
            }

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("❌ Error in /play command:", error);
            embed.setDescription(
                "❌ An error occurred while trying to play the music."
            );
            return interaction.editReply({ embeds: [embed] });
        }
    }
}
