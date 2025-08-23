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
class Remove extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "remove",
            description: "Removes a track from the queue.",
            category: Category_1.default.Music,
            cooldown: 0,
            dmPermission: false,
            dev: false,
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.Connect,
            options: [
                {
                    name: "position",
                    description: "Position of the track to remove (starts at 1).",
                    type: Types_1.default.Integer,
                    required: true,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.client;
            const embed = new discord_js_1.EmbedBuilder().setColor(0x2b2d31).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            const position = interaction.options.getInteger("position", true);
            const player = client.riffy.players.get(interaction.guildId);
            if (!player || !player.queue.length) {
                embed
                    .setTitle("Remove Track")
                    .setDescription("❌ The queue is empty or nothing is playing.");
                return interaction.editReply({ embeds: [embed] });
            }
            if (position < 1 || position > player.queue.length) {
                embed
                    .setTitle("Invalid Position")
                    .setDescription(`❌ Please enter a position between 1 and ${player.queue.length}.`);
                return interaction.editReply({ embeds: [embed] });
            }
            const removed = player.queue.remove(position - 1);
            embed
                .setTitle("Track Removed")
                .setDescription(`🗑️ Removed **${removed.info.title}** from the queue.`);
            return interaction.editReply({ embeds: [embed] });
        });
    }
}
exports.default = Remove;
