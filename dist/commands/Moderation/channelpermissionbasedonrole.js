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
class ChannelPermissionManager extends Command_1.default {
    /**
     * Creates a new ChannelPermissionManager command instance.
     * @param client The Discord client instance.
     */
    constructor(client) {
        super(client, {
            name: "perm",
            description: "Manage channel permissions for roles.",
            category: Category_1.default.Moderation,
            options: [
                {
                    name: "set",
                    description: "Set permission for a role on a channel.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "channel",
                            description: "Target channel.",
                            type: Types_1.default.Channel,
                            required: true,
                        },
                        {
                            name: "role",
                            description: "Role to set permissions for.",
                            type: Types_1.default.Role,
                            required: true,
                        },
                        {
                            name: "permissions",
                            description: "Permissions to set (comma separated).",
                            type: Types_1.default.String,
                            required: true,
                            autocomplete: true,
                        },
                    ],
                },
                {
                    name: "remove",
                    description: "Remove permission overwrite for a role on a channel.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "channel",
                            description: "Target channel.",
                            type: Types_1.default.Channel,
                            required: true,
                        },
                        {
                            name: "role",
                            description: "Role to remove permissions from.",
                            type: Types_1.default.Role,
                            required: true,
                        },
                    ],
                },
                {
                    name: "setall",
                    description: "Set permissions for a role on all channels.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "role",
                            description: "Role to set permissions for.",
                            type: Types_1.default.Role,
                            required: true,
                        },
                        {
                            name: "permissions",
                            description: "Permissions to set (comma separated).",
                            type: Types_1.default.String,
                            required: true,
                            autocomplete: true,
                        },
                    ],
                },
                {
                    name: "removeall",
                    description: "Remove permission overwrite for a role on all channels.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "role",
                            description: "Role to remove permissions from.",
                            type: Types_1.default.Role,
                            required: true,
                        },
                    ],
                },
            ],
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.ManageChannels,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }
    /**
     * Parses a comma-separated permissions string into an array of valid permission keys.
     * @param permString Permissions string, comma separated.
     * @returns Array of valid permission keys.
     */
    parsePermissions(permString) {
        const allPerms = Object.keys(discord_js_1.PermissionsBitField.Flags);
        return permString
            .split(",")
            .map((p) => p.trim())
            .filter((p) => allPerms.includes(p));
    }
    /**
     * Handles the autocomplete interaction for permission option.
     * Suggests permission flags that start with the current input.
     * @param interaction AutocompleteInteraction instance.
     */
    autocomplete(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const focusedOption = interaction.options.getFocused(true);
            if (focusedOption.name === "permissions" &&
                typeof focusedOption.value === "string") {
                const entered = focusedOption.value.toUpperCase();
                const allPermissions = Object.keys(discord_js_1.PermissionsBitField.Flags);
                // For comma-separated input, autocomplete only the last fragment:
                const parts = entered.split(",");
                const lastPart = (_b = (_a = parts.pop()) === null || _a === void 0 ? void 0 : _a.trim()) !== null && _b !== void 0 ? _b : "";
                // Filter permissions that start with the last fragment
                const filtered = allPermissions
                    .filter((perm) => perm.startsWith(lastPart))
                    .slice(0, 25) // Discord limits to 25 choices max
                    .map((perm) => ({
                    name: perm,
                    value: perm,
                }));
                // If user already typed previous permissions, keep them in the value suggestion
                const baseValue = parts.length ? parts.join(",") + ", " : "";
                yield interaction.respond(filtered.map((choice) => ({
                    name: choice.name,
                    value: baseValue + choice.value,
                })));
            }
            else {
                yield interaction.respond([]);
            }
        });
    }
    /**
     * Executes the command with the given interaction.
     * @param interaction The ChatInputCommandInteraction instance.
     */
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.EmbedBuilder().setColor(0x242429).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            const subcommand = interaction.options.getSubcommand(true);
            const guild = interaction.guild;
            if (!guild) {
                embed.setDescription("❌ This command can only be used in a server.");
                return interaction.editReply({ embeds: [embed] });
            }
            try {
                switch (subcommand) {
                    case "set": {
                        const channel = interaction.options.getChannel("channel", true);
                        const role = interaction.options.getRole("role", true);
                        const permsString = interaction.options.getString("permissions", true);
                        const permissions = this.parsePermissions(permsString);
                        if (!permissions.length) {
                            embed.setDescription("❌ No valid permissions specified.");
                            return interaction.editReply({ embeds: [embed] });
                        }
                        const allowPermissions = permissions.reduce((acc, perm) => (Object.assign(Object.assign({}, acc), { [perm]: true })), {});
                        yield channel.permissionOverwrites.edit(role, allowPermissions);
                        embed.setDescription(`✅ Permissions \`${permissions.join(", ")}\` set for role <@&${role.id}> on channel <#${channel.id}>.`);
                        return interaction.editReply({ embeds: [embed] });
                    }
                    case "remove": {
                        const channel = interaction.options.getChannel("channel", true);
                        const role = interaction.options.getRole("role", true);
                        yield channel.permissionOverwrites.delete(role);
                        embed.setDescription(`✅ Permission overwrites removed for role <@&${role.id}> on channel <#${channel.id}>.`);
                        return interaction.editReply({ embeds: [embed] });
                    }
                    case "setall": {
                        const role = interaction.options.getRole("role", true);
                        const permsString = interaction.options.getString("permissions", true);
                        const permissions = this.parsePermissions(permsString);
                        if (!permissions.length) {
                            embed.setDescription("❌ No valid permissions specified.");
                            return interaction.editReply({ embeds: [embed] });
                        }
                        const allowPermissions = permissions.reduce((acc, perm) => (Object.assign(Object.assign({}, acc), { [perm]: true })), {});
                        const channels = guild.channels.cache.filter((c) => c.type === discord_js_1.ChannelType.GuildText ||
                            c.type === discord_js_1.ChannelType.GuildVoice);
                        for (const channel of channels.values()) {
                            yield channel.permissionOverwrites.edit(role, allowPermissions);
                        }
                        embed.setDescription(`✅ Permissions \`${permissions.join(", ")}\` set for role <@&${role.id}> on all text and voice channels.`);
                        return interaction.editReply({ embeds: [embed] });
                    }
                    case "removeall": {
                        const role = interaction.options.getRole("role", true);
                        const channels = guild.channels.cache.filter((c) => c.type === discord_js_1.ChannelType.GuildText ||
                            c.type === discord_js_1.ChannelType.GuildVoice);
                        for (const channel of channels.values()) {
                            yield channel.permissionOverwrites.delete(role);
                        }
                        embed.setDescription(`✅ Permission overwrites removed for role <@&${role.id}> on all text and voice channels.`);
                        return interaction.editReply({ embeds: [embed] });
                    }
                    default: {
                        embed.setDescription("❌ Unknown subcommand.");
                        return interaction.editReply({ embeds: [embed] });
                    }
                }
            }
            catch (error) {
                embed.setDescription(`❌ Error: ${error.message}`);
                return interaction.editReply({ embeds: [embed] });
            }
        });
    }
}
exports.default = ChannelPermissionManager;
