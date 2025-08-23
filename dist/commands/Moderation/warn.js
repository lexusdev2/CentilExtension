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
//@ts-ignore
const Logging_1 = require("@schemas/Logging");
//@ts-ignore
const Types_1 = __importDefault(require("@enums/Types"));
function generateCaseId() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}
class Warn extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "warn",
            description: "Provides an advanced warning mechanism for server moderation.",
            category: Category_1.default.Moderation,
            options: [
                {
                    name: "issue",
                    description: "Issue a formal warning to a specified user.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "Select the user to receive the warning.",
                            type: Types_1.default.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Specify the reason for the warning.",
                            type: Types_1.default.String,
                            required: false,
                        },
                        {
                            name: "silent",
                            description: "Determine whether the warning should be logged silently, without public notification.",
                            type: Types_1.default.Boolean,
                            required: false,
                        },
                        {
                            name: "duration",
                            description: "Define the duration of the warning (e.g., 7d, 1h). Leave blank for an indefinite warning.",
                            type: Types_1.default.String,
                            required: false,
                        },
                    ],
                },
                {
                    name: "revoke",
                    description: "Revoke a previously issued warning using its case ID.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "caseid",
                            description: "Specify the case ID of the warning to revoke.",
                            type: Types_1.default.String,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Provide a justification for revoking the warning.",
                            type: Types_1.default.String,
                            required: false,
                        },
                    ],
                },
                {
                    name: "history",
                    description: "Display a comprehensive warning history for a specific user.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "Select the user whose warning history should be displayed.",
                            type: Types_1.default.User,
                            required: true,
                        },
                        {
                            name: "includeexpired",
                            description: "Determine whether expired warnings should be included in the results.",
                            type: Types_1.default.Boolean,
                            required: false,
                        },
                    ],
                },
                {
                    name: "details",
                    description: "Retrieve detailed information about a specific warning case.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "caseid",
                            description: "Specify the case ID for which detailed information is required.",
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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            //@ts-ignore
            const embed = new discord_js_1.EmbedBuilder().setColor(0x242429).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            //@ts-ignore
            const subcommand = interaction.options.getSubcommand(true);
            switch (subcommand) {
                case "issue": {
                    const target = interaction.options.getUser("target", true);
                    const reason = interaction.options.getString("reason") ||
                        "No reason was provided.";
                    const silent = (_a = interaction.options.getBoolean("silent")) !== null && _a !== void 0 ? _a : false;
                    const duration = interaction.options.getString("duration");
                    let expiresAt = undefined;
                    if (duration) {
                        const match = duration.match(/^(\d+)([dhms])$/i);
                        if (match) {
                            const value = parseInt(match[1]);
                            const unit = match[2].toLowerCase();
                            const now = Date.now();
                            let ms = 0;
                            if (unit === "d")
                                ms = value * 24 * 60 * 60 * 1000;
                            if (unit === "h")
                                ms = value * 60 * 60 * 1000;
                            if (unit === "m")
                                ms = value * 60 * 1000;
                            if (unit === "s")
                                ms = value * 1000;
                            expiresAt = new Date(now + ms);
                        }
                    }
                    const caseId = generateCaseId();
                    const entry = {
                        usrTag: target.tag,
                        usrName: target.username,
                        usrId: target.id,
                        stffTag: interaction.user.tag,
                        stffName: interaction.user.username,
                        stffId: interaction.user.id,
                        action: "warn",
                        reason,
                        silent,
                        dm: true,
                        timestamp: new Date(),
                        channelId: interaction.channelId,
                        gldId: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id,
                        gldName: (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.name,
                        gldIcon: ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.iconURL()) || undefined,
                        expiresAt,
                        caseId,
                    };
                    yield Logging_1.LoggingModel.create(entry);
                    embed
                        .setTitle("Warning Issued")
                        .setDescription(`**User:** ${target.tag} (${target.id})\n**Moderator:** ${interaction.user.tag}\n**Reason:** ${reason}\n**Silent:** ${silent ? "Yes" : "No"}\n**Case ID:** \`${caseId}\`\n**Expires:** ${expiresAt
                        ? `<t:${Math.floor(expiresAt.getTime() / 1000)}:R>`
                        : "Never"}`);
                    break;
                }
                case "revoke": {
                    const caseId = interaction.options.getString("caseid", true);
                    const reason = interaction.options.getString("reason") ||
                        "No reason was provided.";
                    const log = yield Logging_1.LoggingModel.findOneAndDelete({
                        caseId,
                        gldId: (_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.id,
                        action: "warn",
                    });
                    if (log) {
                        embed
                            .setTitle("Warning Revoked")
                            .setDescription(`**User:** ${log.usrTag} (${log.usrId})\n**Moderator:** ${interaction.user.tag}\n**Case ID:** \`${caseId}\`\n**Reason:** ${reason}`);
                    }
                    else {
                        embed
                            .setTitle("Warning Not Found")
                            .setDescription(`No record of a warning with the case ID \`${caseId}\` was found in this server.`);
                    }
                    break;
                }
                case "history": {
                    const target = interaction.options.getUser("target", true);
                    const includeExpired = (_f = interaction.options.getBoolean("includeexpired")) !== null && _f !== void 0 ? _f : false;
                    const now = new Date();
                    const query = {
                        usrId: target.id,
                        gldId: (_g = interaction.guild) === null || _g === void 0 ? void 0 : _g.id,
                        action: "warn",
                    };
                    if (!includeExpired) {
                        query["$or"] = [
                            { expiresAt: { $exists: false } },
                            { expiresAt: { $gt: now } },
                        ];
                    }
                    const logs = (yield Logging_1.LoggingModel.find(query)
                        .sort({ timestamp: -1 })
                        .lean());
                    if (logs.length === 0) {
                        embed
                            .setTitle("No Warnings Found")
                            .setDescription(`There are no recorded warnings for ${target.tag} in this server.`);
                    }
                    else {
                        embed
                            .setTitle(`Warning History: ${target.tag}`)
                            .setDescription(logs
                            .map((log, i) => {
                            var _a;
                            return `**#${i + 1}** — Case: \`${log.caseId}\`\nReason: ${log.reason || "No reason provided"}\nModerator: ${log.stffTag}\nIssued: <t:${Math.floor((((_a = log.timestamp) === null || _a === void 0 ? void 0 : _a.getTime()) || 0) /
                                1000)}:R>\nExpires: ${log.expiresAt
                                ? `<t:${Math.floor(new Date(log.expiresAt).getTime() / 1000)}:R>`
                                : "Never"}`;
                        })
                            .join("\n\n"));
                    }
                    break;
                }
                case "details": {
                    const caseId = interaction.options.getString("caseid", true);
                    const log = yield Logging_1.LoggingModel.findOne({
                        caseId,
                        gldId: (_h = interaction.guild) === null || _h === void 0 ? void 0 : _h.id,
                        action: "warn",
                    });
                    if (!log) {
                        embed
                            .setTitle("Warning Not Found")
                            .setDescription(`No warning record with the case ID \`${caseId}\` was found in this server.`);
                    }
                    else {
                        embed
                            .setTitle(`Warning Details — Case ID: ${caseId}`)
                            .setDescription(`**User:** ${log.usrTag} (${log.usrId})\n**Moderator:** ${log.stffTag}\n**Reason:** ${log.reason}\n**Issued:** <t:${Math.floor((((_j = log.timestamp) === null || _j === void 0 ? void 0 : _j.getTime()) || 0) / 1000)}:F>\n**Expires:** ${log.expiresAt
                            ? `<t:${Math.floor(new Date(log.expiresAt).getTime() /
                                1000)}:F>`
                            : "Never"}\n**Silent:** ${log.silent ? "Yes" : "No"}`);
                    }
                    break;
                }
            }
            yield interaction.editReply({ embeds: [embed] });
            return;
        });
    }
}
exports.default = Warn;
