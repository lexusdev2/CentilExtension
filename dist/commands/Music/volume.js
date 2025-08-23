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
class Volume extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "volume",
            description: "Adjusts the volume of the player.",
            category: Category_1.default.Music,
            cooldown: 5,
            dmPermission: false,
            dev: false,
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.Connect,
            options: [
                {
                    name: "level",
                    description: "Volume level (0–100).",
                    type: Types_1.default.Integer,
                    required: true,
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const volume = interaction.options.getInteger("level", true);
            const client = this.client;
            const embed = new discord_js_1.EmbedBuilder().setColor(0x2b2d31).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            if (isNaN(volume) || volume < 0 || volume > 100) {
                embed
                    .setTitle("Invalid Volume")
                    .setDescription("❌ Volume must be between 0 and 100.");
                return interaction.editReply({ embeds: [embed] });
            }
            const player = client.riffy.players.get(interaction.guildId);
            if (!player) {
                embed
                    .setTitle("No Player")
                    .setDescription("❌ Nothing is currently playing.");
                return interaction.editReply({ embeds: [embed] });
            }
            player.setVolume(volume);
            embed
                .setTitle("🔊 Volume Changed")
                .setDescription(`Volume set to **${volume}%**`);
            return interaction.editReply({ embeds: [embed] });
        });
    }
}
exports.default = Volume;
