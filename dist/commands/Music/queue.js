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
const Command_1 = __importDefault(require("@classes/Command"));
const Category_1 = __importDefault(require("@enums/Category"));
const discord_js_1 = require("discord.js");
class Queue extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "queue",
            description: "Displays the current music queue.",
            category: Category_1.default.Music,
            options: [],
            cooldown: 2,
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.Connect,
            dmPermission: false,
            dev: false,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.client;
            const embed = new discord_js_1.EmbedBuilder().setColor(0x2b2d31).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            const player = client.riffy.players.get(interaction.guildId);
            if (!player || (!player.current && player.queue.length === 0)) {
                embed
                    .setTitle("Empty Queue")
                    .setDescription("❌ The queue is empty. Use `/play` to add some tracks.");
                return interaction.editReply({ embeds: [embed] });
            }
            const current = player.current;
            const thumbnailUrl = `https://img.youtube.com/vi/${current.info.identifier}/hqdefault.jpg`;
            embed
                .setTitle("🎶 Music Queue")
                .setDescription(`**Now Playing:** [${current.info.title}](${current.info.uri})`)
                .setThumbnail(thumbnailUrl);
            if (player.queue.length > 0) {
                const queuePreview = player.queue
                    .slice(0, 10)
                    .map((track, index) => `\`${index + 1}.\` [${track.info.title}](${track.info.uri})`)
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
            }
            else {
                embed.addFields({
                    name: "Up Next",
                    value: "Queue is empty.",
                });
            }
            return interaction.editReply({ embeds: [embed] });
        });
    }
}
exports.default = Queue;
