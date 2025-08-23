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
const note_1 = require("@schemas/note");
const Types_1 = __importDefault(require("@enums/Types"));
/**
 * Generates a unique, timestamp-based case ID for notes.
 */
function generateCaseId() {
    const now = Date.now().toString(36);
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `N-${now}-${rand}`;
}
/**
 * Formats a note object for display in an embed.
 */
function formatNote(note, index) {
    return [
        `**#${index + 1} | ID:** \`${note.caseId}\``,
        `**Created:** <t:${Math.floor(new Date(note.createdAt).getTime() / 1000)}:R>`,
        `**Content:** ${note.note}`,
        `**By:** <@${note.moderatorId || "Unknown"}>`,
    ].join("\n");
}
class Note extends Command_1.default {
    constructor(client) {
        super(client, {
            name: "note",
            description: "Advanced moderation notes system for server members.",
            category: Category_1.default.Moderation,
            options: [
                {
                    name: "add",
                    description: "Add a new note to a user, with optional anonymity and tags.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "User to add a note for.",
                            type: Types_1.default.User,
                            required: true,
                        },
                        {
                            name: "content",
                            description: "Note content.",
                            type: Types_1.default.String,
                            required: true,
                        },
                        {
                            name: "anonymous",
                            description: "Hide your identity as the note author.",
                            type: Types_1.default.Boolean,
                            required: false,
                        },
                        {
                            name: "tags",
                            description: "Comma-separated tags for this note.",
                            type: Types_1.default.String,
                            required: false,
                        },
                    ],
                },
                {
                    name: "remove",
                    description: "Remove a note by its ID.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "User whose note to remove.",
                            type: Types_1.default.User,
                            required: true,
                        },
                        {
                            name: "note-id",
                            description: "Case ID of the note.",
                            type: Types_1.default.String,
                            required: true,
                        },
                    ],
                },
                {
                    name: "list",
                    description: "List all notes for a user, with filtering and pagination.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "User whose notes to list.",
                            type: Types_1.default.User,
                            required: true,
                        },
                        {
                            name: "tag",
                            description: "Filter notes by tag.",
                            type: Types_1.default.String,
                            required: false,
                        },
                        {
                            name: "page",
                            description: "Page number for pagination.",
                            type: Types_1.default.Integer,
                            required: false,
                        },
                    ],
                },
                {
                    name: "clear",
                    description: "Clear all notes for a user, with confirmation.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "User whose notes to clear.",
                            type: Types_1.default.User,
                            required: true,
                        },
                        {
                            name: "confirm",
                            description: "Type 'CONFIRM' to proceed.",
                            type: Types_1.default.String,
                            required: true,
                        },
                    ],
                },
                {
                    name: "search",
                    description: "Search notes by keyword across all users.",
                    type: Types_1.default.SubCommand,
                    options: [
                        {
                            name: "keyword",
                            description: "Keyword to search for.",
                            type: Types_1.default.String,
                            required: true,
                        },
                        {
                            name: "limit",
                            description: "Max results (default 5).",
                            type: Types_1.default.Integer,
                            required: false,
                        },
                    ],
                },
                {
                    name: "stats",
                    description: "Show statistics about notes in the server.",
                    type: Types_1.default.SubCommand,
                },
            ],
            DefaultMemberPermissions: discord_js_1.PermissionsBitField.Flags.ManageRoles,
            dmPermission: false,
            cooldown: 5,
            dev: true,
        });
    }
    Execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new discord_js_1.EmbedBuilder().setColor(0x242429).setTimestamp();
            yield interaction.deferReply({ ephemeral: true });
            const subcommand = interaction.options.getSubcommand(true);
            switch (subcommand) {
                case "add": {
                    const target = interaction.options.getUser("target", true);
                    const content = interaction.options.getString("content", true);
                    const anonymous = interaction.options.getBoolean("anonymous") || false;
                    const tagsRaw = interaction.options.getString("tags") || "";
                    const tags = tagsRaw
                        .split(",")
                        .map((t) => t.trim().toLowerCase())
                        .filter((t) => t.length > 0);
                    const note = new note_1.NoteModel({
                        usr: target.id,
                        id: target.id,
                        note: content,
                        createdAt: new Date(),
                        caseId: generateCaseId(),
                        moderatorId: anonymous ? null : interaction.user.id,
                        tags,
                    });
                    yield note.save();
                    embed.setDescription(`📝 Note added for <@${target.id}> with ID \`${note.caseId}\`.\n` +
                        (tags.length
                            ? `**Tags:** ${tags
                                .map((t) => `\`${t}\``)
                                .join(", ")}`
                            : "") +
                        (anonymous ? "\n*Note was added anonymously.*" : ""));
                    break;
                }
                case "remove": {
                    const target = interaction.options.getUser("target", true);
                    const noteId = interaction.options.getString("note-id", true);
                    const note = yield note_1.NoteModel.findOneAndDelete({
                        usr: target.id,
                        caseId: noteId,
                    });
                    if (!note) {
                        embed.setDescription(`❌ No note found for <@${target.id}> with ID \`${noteId}\`.`);
                        break;
                    }
                    embed.setDescription(`🗑️ Note with ID \`${note.caseId}\` removed for <@${target.id}>.`);
                    break;
                }
                case "list": {
                    const target = interaction.options.getUser("target", true);
                    const tag = interaction.options.getString("tag");
                    const page = Math.max(1, interaction.options.getInteger("page") || 1);
                    const PAGE_SIZE = 5;
                    let query = { usr: target.id };
                    if (tag)
                        query.tags = tag.toLowerCase();
                    const totalNotes = yield note_1.NoteModel.countDocuments(query);
                    const notes = yield note_1.NoteModel.find(query)
                        .sort({ createdAt: -1 })
                        .skip((page - 1) * PAGE_SIZE)
                        .limit(PAGE_SIZE);
                    if (notes.length === 0) {
                        embed.setDescription(tag
                            ? `No notes found for <@${target.id}> with tag \`${tag}\`.`
                            : `No notes found for <@${target.id}>.`);
                        break;
                    }
                    embed.setTitle(`Notes for <@${target.id}> (Page ${page}/${Math.ceil(totalNotes / PAGE_SIZE)})`);
                    embed.setDescription(notes
                        .map((n, i) => formatNote(n, (page - 1) * PAGE_SIZE + i))
                        .join("\n\n"));
                    break;
                }
                case "clear": {
                    const target = interaction.options.getUser("target", true);
                    const confirm = interaction.options.getString("confirm", true);
                    if (confirm !== "CONFIRM") {
                        embed.setDescription("⚠️ To clear all notes, you must type `CONFIRM` in the confirm field.");
                        break;
                    }
                    const result = yield note_1.NoteModel.deleteMany({ usr: target.id });
                    embed.setDescription(`🧹 Cleared **${result.deletedCount}** notes for <@${target.id}>.`);
                    break;
                }
                case "search": {
                    const keyword = interaction.options.getString("keyword", true);
                    const limit = Math.max(1, Math.min(20, interaction.options.getInteger("limit") || 5));
                    const notes = yield note_1.NoteModel.find({
                        note: { $regex: keyword, $options: "i" },
                    })
                        .sort({ createdAt: -1 })
                        .limit(limit);
                    if (notes.length === 0) {
                        embed.setDescription(`No notes found containing \`${keyword}\`.`);
                        break;
                    }
                    embed.setTitle(`Search results for \`${keyword}\``);
                    embed.setDescription(notes
                        .map((n, i) => `**User:** <@${n.usr}> | **ID:** \`${n.caseId}\`\n${n.note}`)
                        .join("\n\n"));
                    break;
                }
                case "stats": {
                    const total = yield note_1.NoteModel.countDocuments();
                    const users = yield note_1.NoteModel.distinct("usr");
                    const topUsers = yield note_1.NoteModel.aggregate([
                        { $group: { _id: "$usr", count: { $sum: 1 } } },
                        { $sort: { count: -1 } },
                        { $limit: 3 },
                    ]);
                    embed.setTitle("Moderation Notes Statistics");
                    embed.setDescription([
                        `**Total notes:** ${total}`,
                        `**Users with notes:** ${users.length}`,
                        `**Top users:**`,
                        ...topUsers.map((u, i) => `\`${i + 1}.\` <@${u._id}> — **${u.count}** notes`),
                    ].join("\n"));
                    break;
                }
            }
            yield interaction.editReply({ embeds: [embed] });
        });
    }
}
exports.default = Note;
