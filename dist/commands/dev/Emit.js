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
const Types_1 = __importDefault(require("@enums/Types"));
const discord_js_1 = require("discord.js");
class Emit extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "emit",
            description: "Manually emit a Discord event for testing purposes.",
            dev: false,
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.Administrator,
            dmPermission: true,
            category: Category_1.default.Developer,
            cooldown: 2,
            options: [
                {
                    name: "event",
                    description: "The Discord event to emit (limited to 25).",
                    required: true,
                    type: Types_1.default.String,
                    choices: [
                        { name: "GuildCreate", value: discord_js_1.Events.GuildCreate },
                        { name: "GuildDelete", value: discord_js_1.Events.GuildDelete },
                        { name: "ChannelCreate", value: discord_js_1.Events.ChannelCreate },
                        { name: "ChannelDelete", value: discord_js_1.Events.ChannelDelete },
                        { name: "ChannelUpdate", value: discord_js_1.Events.ChannelUpdate },
                        { name: "MessageCreate", value: discord_js_1.Events.MessageCreate },
                        { name: "MessageDelete", value: discord_js_1.Events.MessageDelete },
                        { name: "MessageUpdate", value: discord_js_1.Events.MessageUpdate },
                        {
                            name: "GuildMemberAdd",
                            value: discord_js_1.Events.GuildMemberAdd,
                        },
                        {
                            name: "GuildMemberRemove",
                            value: discord_js_1.Events.GuildMemberRemove,
                        },
                        {
                            name: "GuildMemberUpdate",
                            value: discord_js_1.Events.GuildMemberUpdate,
                        },
                        {
                            name: "PresenceUpdate",
                            value: discord_js_1.Events.PresenceUpdate,
                        },
                        {
                            name: "VoiceStateUpdate",
                            value: discord_js_1.Events.VoiceStateUpdate,
                        },
                        { name: "GuildBanAdd", value: discord_js_1.Events.GuildBanAdd },
                        {
                            name: "GuildBanRemove",
                            value: discord_js_1.Events.GuildBanRemove,
                        },
                        { name: "InviteCreate", value: discord_js_1.Events.InviteCreate },
                        { name: "InviteDelete", value: discord_js_1.Events.InviteDelete },
                        { name: "ThreadCreate", value: discord_js_1.Events.ThreadCreate },
                        { name: "ThreadDelete", value: discord_js_1.Events.ThreadDelete },
                        { name: "ThreadUpdate", value: discord_js_1.Events.ThreadUpdate },
                        { name: "UserUpdate", value: discord_js_1.Events.UserUpdate },
                        {
                            name: "InteractionCreate",
                            value: discord_js_1.Events.InteractionCreate,
                        },
                        {
                            name: "GuildRoleCreate",
                            value: discord_js_1.Events.GuildRoleCreate,
                        },
                        {
                            name: "GuildRoleDelete",
                            value: discord_js_1.Events.GuildRoleDelete,
                        },
                        {
                            name: "GuildRoleUpdate",
                            value: discord_js_1.Events.GuildRoleUpdate,
                        },
                    ],
                },
            ],
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const event = interaction.options.getString("event", true);
            const embed = new discord_js_1.EmbedBuilder().setColor(0x242429).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            const guild = interaction.guild;
            const member = interaction.member instanceof discord_js_1.GuildMember
                ? interaction.member
                : null;
            const channel = interaction.channel instanceof discord_js_1.TextChannel
                ? interaction.channel
                : null;
            switch (event) {
                case discord_js_1.Events.GuildCreate:
                case discord_js_1.Events.GuildDelete:
                    if (guild)
                        this.client.emit(event, guild);
                    break;
                case discord_js_1.Events.ChannelCreate:
                case discord_js_1.Events.ChannelDelete:
                    if (channel)
                        this.client.emit(event, channel);
                    break;
                case discord_js_1.Events.ChannelUpdate:
                    if (channel)
                        this.client.emit(event, channel, channel);
                    break;
                case discord_js_1.Events.MessageCreate:
                case discord_js_1.Events.MessageDelete:
                    if (channel) {
                        const messages = yield channel.messages.fetch({ limit: 1 });
                        const msg = messages.first();
                        if (msg)
                            this.client.emit(event, msg);
                    }
                    break;
                case discord_js_1.Events.MessageUpdate:
                    if (channel) {
                        const messages = yield channel.messages.fetch({ limit: 1 });
                        const msg = messages.first();
                        if (msg)
                            this.client.emit(event, msg, msg);
                    }
                    break;
                case discord_js_1.Events.GuildMemberAdd:
                case discord_js_1.Events.GuildMemberRemove:
                    if (member)
                        this.client.emit(event, member);
                    break;
                case discord_js_1.Events.GuildMemberUpdate:
                    if (member)
                        this.client.emit(event, member, member);
                    break;
                case discord_js_1.Events.PresenceUpdate:
                    if (member && member.presence) {
                        this.client.emit(event, member.presence, member.presence);
                    }
                    break;
                case discord_js_1.Events.VoiceStateUpdate:
                    if (member && member.voice) {
                        this.client.emit(event, member.voice, member.voice);
                    }
                    break;
                case discord_js_1.Events.GuildBanAdd:
                case discord_js_1.Events.GuildBanRemove:
                case discord_js_1.Events.InviteCreate:
                case discord_js_1.Events.InviteDelete:
                case discord_js_1.Events.ThreadCreate:
                case discord_js_1.Events.ThreadDelete:
                case discord_js_1.Events.ThreadUpdate:
                case discord_js_1.Events.UserUpdate:
                case discord_js_1.Events.InteractionCreate:
                case discord_js_1.Events.GuildRoleCreate:
                case discord_js_1.Events.GuildRoleDelete:
                case discord_js_1.Events.GuildRoleUpdate:
                    embed.setDescription(`⚠️ The event \`${event}\` is valid but not handled specifically.`);
                    yield interaction.editReply({ embeds: [embed] });
                    return;
                default:
                    embed.setDescription(`❌ Unknown event: \`${event}\`.`);
                    yield interaction.editReply({ embeds: [embed] });
                    return;
            }
            embed.setDescription(`✅ Successfully emitted event: \`${event}\``);
            yield interaction.editReply({ embeds: [embed] });
        });
    }
}
exports.default = Emit;
