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
// @ts-ignore
const Types_1 = __importDefault(require("@enums/Types"));
class TurnRoleIntoUnverified extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "turnroleintounverified",
            description: "Restrict a role to only view and interact with a verification channel.",
            category: Category_1.default.Moderation,
            options: [
                {
                    name: "role",
                    description: "The role to restrict.",
                    type: Types_1.default.Role,
                    required: true,
                },
                {
                    name: "channel",
                    description: "The only channel the role can access (e.g., for verification).",
                    type: Types_1.default.Channel,
                    channelTypes: [discord_js_1.ChannelType.GuildText],
                    required: true,
                },
            ],
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.ManageRoles,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const embed = new discord_js_1.EmbedBuilder().setColor(0x242429).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            const role = interaction.options.getRole("role", true);
            const targetChannel = interaction.options.getChannel("channel", true);
            const guild = interaction.guild;
            if (!guild) {
                embed.setDescription("❌ This command can only be used in a guild.");
                yield interaction.editReply({ embeds: [embed] });
                return;
            }
            const failedChannels = [];
            for (const [, channel] of guild.channels.cache) {
                // @ts-ignore
                if (!((_a = channel === null || channel === void 0 ? void 0 : channel.isTextBased) === null || _a === void 0 ? void 0 : _a.call(channel)) ||
                    !(channel === null || channel === void 0 ? void 0 : channel.permissionsFor) ||
                    !("permissionOverwrites" in channel))
                    continue;
                try {
                    yield channel.permissionOverwrites.edit(role, {
                        viewChannel: channel.id === targetChannel.id,
                        readMessageHistory: channel.id === targetChannel.id,
                        sendMessages: channel.id === targetChannel.id,
                    });
                }
                catch (_c) {
                    failedChannels.push((_b = channel.name) !== null && _b !== void 0 ? _b : channel.id);
                }
            }
            embed.setDescription(`🔒 Role <@&${role.id}> is now restricted:\n\n` +
                `- ✅ Can view & send messages in: <#${targetChannel.id}>\n` +
                `- ❌ Cannot access any other channels.` +
                (failedChannels.length
                    ? `\n\n⚠️ Failed to update some channels: ${failedChannels.join(", ")}`
                    : ""));
            yield interaction.editReply({ embeds: [embed] });
            return;
        });
    }
}
exports.default = TurnRoleIntoUnverified;
