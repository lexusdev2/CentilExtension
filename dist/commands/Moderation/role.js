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
class RoleManager extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "role",
            description: "Manage server roles with advanced options.",
            category: Category_1.default.Moderation,
            options: [
                {
                    name: "create",
                    description: "Create a new server role with customization.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "name",
                            description: "Name for the new role.",
                            type: Types_1.default.String,
                            required: true,
                        },
                        {
                            name: "color",
                            description: "Hex color code (e.g., #1abc9c).",
                            type: Types_1.default.String,
                            required: false,
                        },
                        {
                            name: "permissions",
                            description: "Comma-separated permission flags.",
                            type: Types_1.default.String,
                            required: false,
                        },
                        {
                            name: "hoist",
                            description: "Display role members separately.",
                            type: Types_1.default.Boolean,
                            required: false,
                        },
                        {
                            name: "mentionable",
                            description: "Allow the role to be mentioned.",
                            type: Types_1.default.Boolean,
                            required: false,
                        },
                    ],
                },
                {
                    name: "delete",
                    description: "Delete an existing role by its name.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "name",
                            description: "Exact name of the role to delete.",
                            type: Types_1.default.String,
                            required: true,
                        },
                    ],
                },
                {
                    name: "info",
                    description: "Retrieve details about a specific role.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "name",
                            description: "Name of the role to inspect.",
                            type: Types_1.default.String,
                            required: true,
                        },
                    ],
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
            var _a, _b, _c, _d, _e;
            //@ts-ignore
            const embed = new discord_js_1.EmbedBuilder().setColor(0x242429).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            //@ts-ignore
            const subcommand = interaction.options.getSubcommand(true);
            switch (subcommand) {
                case "create": {
                    const name = interaction.options.getString("name", true);
                    const color = interaction.options.getString("color") || "#000000";
                    const permissionsInput = interaction.options.getString("permissions") || "";
                    const hoist = (_a = interaction.options.getBoolean("hoist")) !== null && _a !== void 0 ? _a : false;
                    const mentionable = (_b = interaction.options.getBoolean("mentionable")) !== null && _b !== void 0 ? _b : false;
                    const permissions = permissionsInput
                        .split(",")
                        .map((p) => p.trim().toUpperCase())
                        .filter(Boolean);
                    try {
                        const role = yield ((_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.roles.create({
                            name,
                            color: parseInt(color.replace(/^#/, ""), 16),
                            permissions: permissions.length > 0
                                ? discord_js_1.PermissionsBitField.resolve(permissions)
                                : undefined,
                            hoist,
                            mentionable,
                            reason: `Role created by ${interaction.user.tag}`,
                        }));
                        embed.setDescription(`✅ The role **${role === null || role === void 0 ? void 0 : role.name}** has been successfully created.`);
                    }
                    catch (error) {
                        embed.setDescription(`❌ Failed to create the role. Details: ${error.message || error}`);
                    }
                    break;
                }
                case "delete": {
                    const name = interaction.options.getString("name", true);
                    const role = (_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.roles.cache.find((r) => r.name === name);
                    if (!role) {
                        embed.setDescription(`❌ The role **${name}** was not found in the server.`);
                        break;
                    }
                    try {
                        yield role.delete(`Role deleted by ${interaction.user.tag}`);
                        embed.setDescription(`✅ The role **${role.name}** has been successfully deleted.`);
                    }
                    catch (error) {
                        embed.setDescription(`❌ Failed to delete the role. Details: ${error.message || error}`);
                    }
                    break;
                }
                case "info": {
                    const name = interaction.options.getString("name", true);
                    const role = (_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.roles.cache.find((r) => r.name === name);
                    if (!role) {
                        embed.setDescription(`❌ The role **${name}** could not be found in the server.`);
                        break;
                    }
                    embed.setTitle(`Role Information: ${role.name}`).addFields({ name: "Role ID", value: role.id, inline: false }, { name: "Color", value: role.hexColor, inline: false }, {
                        name: "Permissions",
                        value: role.permissions.toArray().join(", ") || "None",
                    }, {
                        name: "Displayed Separately",
                        value: role.hoist ? "Yes" : "No",
                        inline: false,
                    }, {
                        name: "Mentionable",
                        value: role.mentionable ? "Yes" : "No",
                        inline: false,
                    }, {
                        name: "Member Count",
                        value: `${role.members.size}`,
                        inline: false,
                    }, {
                        name: "Date Created",
                        value: `<t:${Math.floor(role.createdTimestamp / 1000)}:F>`,
                        inline: false,
                    });
                    break;
                }
            }
            yield interaction.editReply({ embeds: [embed] });
            return;
        });
    }
}
exports.default = RoleManager;
