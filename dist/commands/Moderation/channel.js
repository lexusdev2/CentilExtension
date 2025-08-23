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
class ChannelManager extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "channel",
            description: "Advanced channel management commands.",
            category: Category_1.default.Moderation,
            options: [
                {
                    name: "create",
                    description: "Create a new channel with advanced options.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "name",
                            description: "Channel name.",
                            type: Types_1.default.Channel,
                            required: true,
                        },
                        {
                            name: "topic",
                            description: "Channel topic.",
                            type: Types_1.default.String,
                            required: false,
                        },
                        {
                            name: "slowmode",
                            description: "Slowmode (seconds).",
                            type: Types_1.default.Integer,
                            required: false,
                        },
                        {
                            name: "adult",
                            description: "Is NSFW?",
                            type: Types_1.default.Boolean,
                            required: false,
                        },
                        {
                            name: "category",
                            description: "Parent category name.",
                            type: Types_1.default.String,
                            required: false,
                        },
                        {
                            name: "private",
                            description: "Make channel private.",
                            type: Types_1.default.Boolean,
                            required: false,
                        },
                        {
                            name: "user",
                            description: "User to grant access (if private).",
                            type: Types_1.default.User,
                            required: false,
                        },
                    ],
                },
                {
                    name: "delete",
                    description: "Delete a channel by name or ID.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "identifier",
                            description: "Channel name or ID.",
                            type: Types_1.default.Channel,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Reason for deletion.",
                            type: Types_1.default.String,
                            required: false,
                        },
                    ],
                },
                {
                    name: "info",
                    description: "Get detailed info about a channel.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "identifier",
                            description: "Channel name or ID.",
                            type: Types_1.default.Channel,
                            required: true,
                        },
                    ],
                },
                {
                    name: "locking",
                    description: "Sets what state should the channel should be.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "identifier",
                            description: "Channel name or ID.",
                            type: Types_1.default.Channel,
                            required: true,
                            options: [
                                {
                                    name: "lock",
                                    description: "Lock the channel.",
                                    type: Types_1.default.Boolean,
                                    required: true,
                                },
                                {
                                    name: "reason",
                                    description: "Reason for locking the channel.",
                                    type: Types_1.default.String,
                                    required: false,
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "lockdown",
                    description: "Sets all channel to lock.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "lock",
                            description: "Should the channel be locked?",
                            type: Types_1.default.Boolean,
                            required: true,
                            options: [],
                        },
                    ],
                },
                {
                    name: "list",
                    description: "List all channels in the server.",
                    type: Types_1.default.SubCommand,
                },
            ],
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.ManageChannels,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
            const embed = new discord_js_1.EmbedBuilder().setColor(0x242429).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            const subcommand = interaction.options.getSubcommand(true);
            switch (subcommand) {
                case "create": {
                    const name = interaction.options.getString("name", true);
                    const topic = (_a = interaction.options.getString("topic")) !== null && _a !== void 0 ? _a : undefined;
                    const slowmode = (_b = interaction.options.getInteger("slowmode")) !== null && _b !== void 0 ? _b : 0;
                    const adult = (_c = interaction.options.getBoolean("adult")) !== null && _c !== void 0 ? _c : false;
                    const categoryName = (_d = interaction.options.getString("category")) !== null && _d !== void 0 ? _d : undefined;
                    const isPrivate = (_e = interaction.options.getBoolean("private")) !== null && _e !== void 0 ? _e : false;
                    const user = (_f = interaction.options.getUser("user")) !== null && _f !== void 0 ? _f : undefined;
                    let parentId = undefined;
                    if (categoryName) {
                        const category = (_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.channels.cache.find((c) => c.type === discord_js_1.ChannelType.GuildCategory &&
                            c.name === categoryName);
                        if (!category) {
                            embed.setDescription(`❌ Category "${categoryName}" not found.`);
                            return interaction.editReply({ embeds: [embed] });
                        }
                        parentId = category.id;
                    }
                    let permissionOverwrites = undefined;
                    if (isPrivate) {
                        permissionOverwrites = [
                            {
                                id: interaction.guild.roles.everyone.id,
                                deny: [discord_js_1.PermissionsBitField.Flags.ViewChannel],
                            },
                        ];
                        if (user) {
                            permissionOverwrites.push({
                                id: user.id,
                                allow: [discord_js_1.PermissionsBitField.Flags.ViewChannel],
                            });
                        }
                    }
                    const createdChannel = yield ((_h = interaction.guild) === null || _h === void 0 ? void 0 : _h.channels.create({
                        name,
                        type: discord_js_1.ChannelType.GuildText,
                        topic,
                        rateLimitPerUser: slowmode,
                        nsfw: adult,
                        parent: parentId,
                        permissionOverwrites,
                    }));
                    embed.setDescription(`✅ Channel <#${createdChannel === null || createdChannel === void 0 ? void 0 : createdChannel.id}> created successfully.${isPrivate ? " (Private)" : ""}`);
                    return interaction.editReply({ embeds: [embed] });
                }
                case "delete": {
                    const identifier = interaction.options.getString("identifier", true);
                    const reason = (_j = interaction.options.getString("reason")) !== null && _j !== void 0 ? _j : "No reason provided.";
                    let channel = (_k = interaction.guild) === null || _k === void 0 ? void 0 : _k.channels.cache.find((c) => c.id === identifier || c.name === identifier);
                    if (!channel) {
                        embed.setDescription(`❌ Channel "${identifier}" not found.`);
                        return interaction.editReply({ embeds: [embed] });
                    }
                    yield channel.delete(reason);
                    embed.setDescription(`🗑️ Channel "${channel.name}" deleted successfully.`);
                    return interaction.editReply({ embeds: [embed] });
                }
                case "info": {
                    const identifier = interaction.options.getString("identifier", true);
                    let channel = (_l = interaction.guild) === null || _l === void 0 ? void 0 : _l.channels.cache.find((c) => c.id === identifier || c.name === identifier);
                    if (!channel) {
                        embed.setDescription(`❌ Channel "${identifier}" not found.`);
                        return interaction.editReply({ embeds: [embed] });
                    }
                    embed.setDescription(`**Channel Info:**\n` +
                        `• Name: ${channel.name}\n` +
                        `• ID: ${channel.id}\n` +
                        `• Type: ${discord_js_1.ChannelType[channel.type]}\n` +
                        `• NSFW: ${"nsfw" in channel && channel.nsfw
                            ? "Yes"
                            : "No"}\n` +
                        `• Parent: ${channel.parent ? channel.parent.name : "None"}\n` +
                        `• Position: ${channel.position}\n` +
                        `• Created: <t:${Math.floor(channel.createdTimestamp / 1000)}:R>`);
                    return interaction.editReply({ embeds: [embed] });
                }
                case "list": {
                    const channels = (_m = interaction.guild) === null || _m === void 0 ? void 0 : _m.channels.cache.filter((c) => c.type === discord_js_1.ChannelType.GuildText ||
                        c.type === discord_js_1.ChannelType.GuildVoice).sort((a, b) => a.position - b.position).map((c) => `• <#${c.id}> (${discord_js_1.ChannelType[c.type]})`).join("\n");
                    embed.setDescription(`**Server Channels:**\n${(channels === null || channels === void 0 ? void 0 : channels.length) ? channels : "No channels found."}`);
                    return interaction.editReply({ embeds: [embed] });
                }
                case "locking": {
                    const identifier = interaction.options.getString("identifier", true);
                    const lock = interaction.options.getBoolean("lock", true);
                    const reason = (_o = interaction.options.getString("reason")) !== null && _o !== void 0 ? _o : "No reason provided.";
                    let channel = (_p = interaction.guild) === null || _p === void 0 ? void 0 : _p.channels.cache.find((c) => c.id === identifier || c.name === identifier);
                    if (!channel) {
                        embed.setDescription(`❌ Channel "${identifier}" not found.`);
                        return interaction.editReply({ embeds: [embed] });
                    }
                    if (channel.type !== discord_js_1.ChannelType.GuildText) {
                        embed.setDescription("❌ This command can only be used on text channels.");
                        return interaction.editReply({ embeds: [embed] });
                    }
                    yield channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                        SendMessages: !lock,
                        ViewChannel: !lock,
                    });
                    embed.setDescription(`🔒 Channel <#${channel.id}> is now ${lock ? "locked" : "unlocked"}. Reason: ${reason}`);
                    return interaction.editReply({ embeds: [embed] });
                }
                case "lockdown": {
                    const lock = interaction.options.getBoolean("lock", true);
                    const channels = (_q = interaction.guild) === null || _q === void 0 ? void 0 : _q.channels.cache.filter((c) => c.type === discord_js_1.ChannelType.GuildText ||
                        c.type === discord_js_1.ChannelType.GuildVoice);
                    if (!channels || channels.size === 0) {
                        embed.setDescription("❌ No channels found in the server.");
                        return interaction.editReply({ embeds: [embed] });
                    }
                    for (const channel of channels.values()) {
                        if (channel.type !== discord_js_1.ChannelType.GuildText)
                            continue;
                        yield channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                            SendMessages: !lock,
                            ViewChannel: !lock,
                        });
                    }
                    embed.setDescription(`🔒 All text channels are now ${lock ? "locked" : "unlocked"}.`);
                    return interaction.editReply({ embeds: [embed] });
                }
            }
            return;
        });
    }
}
exports.default = ChannelManager;
