"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = __importDefault(require("@classes/Command"));
const Category_1 = __importDefault(require("@enums/Category"));
const Types_1 = __importDefault(require("@enums/Types"));
class Play extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "play",
            description: "Searches YouTube or Spotify and queues a song or playlist.",
            category: Category_1.default.Music,
            options: [
                {
                    name: "query",
                    description: "Provide a song name or URL to play music.",
                    type: Types_1.default.String,
                    required: true,
                },
            ],
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.Connect,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const query = interaction.options.getString("query", true);
            const member = interaction.member;
            const voiceChannel = (_a = member.voice) === null || _a === void 0 ? void 0 : _a.channel;
            const client = this.client;
            const embed = new discord_js_1.EmbedBuilder().setColor(0x2b2d31).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            if (!voiceChannel) {
                embed.setDescription("❌ You must be in a voice channel to use this command.");
                return interaction.editReply({ embeds: [embed] });
            }
            try {
                const player = client.riffy.createConnection({
                    guildId: interaction.guildId,
                    voiceChannel: voiceChannel.id,
                    textChannel: interaction.channelId,
                    deaf: false,
                });
                const resolve = yield client.riffy.resolve({
                    query,
                    requester: interaction.user,
                });
                const { loadType, tracks, playlistInfo } = resolve;
                if (!tracks.length) {
                    embed.setDescription("❌ No results found. Try a different query.");
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
                        .setDescription(`[${(_b = playlistInfo.name) !== null && _b !== void 0 ? _b : "Unknown Playlist"}](${(_c = tracks[0].info.uri) !== null && _c !== void 0 ? _c : "#"})\n**Tracks:** ${tracks.length}`)
                        .addFields({
                        name: "Requested by",
                        value: `<@${interaction.user.id}>`,
                        inline: false,
                    });
                    if (!player.playing &&
                        !player.paused &&
                        player.queue.size > 0) {
                        yield player.play();
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
                    .reduce((acc, t) => acc + (t.info.length || 0), 0);
                const duration = track.info.length
                    ? `${Math.floor(track.info.length / 60000)}:${String(Math.floor((track.info.length % 60000) / 1000)).padStart(2, "0")}`
                    : "Live";
                const eta = queueDuration
                    ? `${Math.floor(queueDuration / 60000)}:${String(Math.floor((queueDuration % 60000) / 1000)).padStart(2, "0")}`
                    : position === 1
                        ? "Now"
                        : "Soon";
                if (!player.playing && !player.paused && queueArray.length > 0) {
                    yield player.play();
                }
                const identifier = track.info.identifier;
                const thumbnailUrl = identifier
                    ? `https://img.youtube.com/vi/${identifier}/hqdefault.jpg`
                    : undefined;
                embed
                    .setTitle("🎶 Added to Queue")
                    .setDescription(`[${(_d = track.info.title) !== null && _d !== void 0 ? _d : "Unknown Track"}](${(_e = track.info.uri) !== null && _e !== void 0 ? _e : "#"})`)
                    .addFields({
                    name: "Channel",
                    value: (_f = track.info.author) !== null && _f !== void 0 ? _f : "Unknown",
                    inline: true,
                }, {
                    name: "Song Duration",
                    value: duration,
                    inline: true,
                }, {
                    name: "Estimated time until playing",
                    value: eta,
                    inline: true,
                }, {
                    name: "Position in queue",
                    value: `${position}`,
                    inline: true,
                });
                if (thumbnailUrl) {
                    embed.setThumbnail(thumbnailUrl);
                }
                return interaction.editReply({ embeds: [embed] });
            }
            catch (error) {
                console.error("❌ Error in /play command:", error);
                embed.setDescription("❌ An error occurred while trying to play the music.");
                return interaction.editReply({ embeds: [embed] });
            }
        });
    }
}
exports.default = Play;
