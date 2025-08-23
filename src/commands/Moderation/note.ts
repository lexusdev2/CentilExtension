import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";
import { NoteModel } from "@schemas/note";
import Types from "@enums/Types";

/**
 * Generates a unique, timestamp-based case ID for notes.
 */
function generateCaseId(): string {
    const now = Date.now().toString(36);
    const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `N-${now}-${rand}`;
}

/**
 * Formats a note object for display in an embed.
 */
function formatNote(note: any, index: number): string {
    return [
        `**#${index + 1} | ID:** \`${note.caseId}\``,
        `**Created:** <t:${Math.floor(
            new Date(note.createdAt).getTime() / 1000
        )}:R>`,
        `**Content:** ${note.note}`,
        `**By:** <@${note.moderatorId || "Unknown"}>`,
    ].join("\n");
}

export default class Note extends Command {
    constructor(client: any) {
        super(client, {
            name: "note",
            description: "Advanced moderation notes system for server members.",
            category: Category.Moderation,
            options: [
                {
                    name: "add",
                    description:
                        "Add a new note to a user, with optional anonymity and tags.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "User to add a note for.",
                            type: Types.User,
                            required: true,
                        },
                        {
                            name: "content",
                            description: "Note content.",
                            type: Types.String,
                            required: true,
                        },
                        {
                            name: "anonymous",
                            description:
                                "Hide your identity as the note author.",
                            type: Types.Boolean,
                            required: false,
                        },
                        {
                            name: "tags",
                            description: "Comma-separated tags for this note.",
                            type: Types.String,
                            required: false,
                        },
                    ],
                },
                {
                    name: "remove",
                    description: "Remove a note by its ID.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "User whose note to remove.",
                            type: Types.User,
                            required: true,
                        },
                        {
                            name: "note-id",
                            description: "Case ID of the note.",
                            type: Types.String,
                            required: true,
                        },
                    ],
                },
                {
                    name: "list",
                    description:
                        "List all notes for a user, with filtering and pagination.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "User whose notes to list.",
                            type: Types.User,
                            required: true,
                        },
                        {
                            name: "tag",
                            description: "Filter notes by tag.",
                            type: Types.String,
                            required: false,
                        },
                        {
                            name: "page",
                            description: "Page number for pagination.",
                            type: Types.Integer,
                            required: false,
                        },
                    ],
                },
                {
                    name: "clear",
                    description:
                        "Clear all notes for a user, with confirmation.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "target",
                            description: "User whose notes to clear.",
                            type: Types.User,
                            required: true,
                        },
                        {
                            name: "confirm",
                            description: "Type 'CONFIRM' to proceed.",
                            type: Types.String,
                            required: true,
                        },
                    ],
                },
                {
                    name: "search",
                    description: "Search notes by keyword across all users.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "keyword",
                            description: "Keyword to search for.",
                            type: Types.String,
                            required: true,
                        },
                        {
                            name: "limit",
                            description: "Max results (default 5).",
                            type: Types.Integer,
                            required: false,
                        },
                    ],
                },
                {
                    name: "stats",
                    description: "Show statistics about notes in the server.",
                    type: Types.SubCommand,
                },
            ],
            DefaultMemberPermissions: PermissionsBitField.Flags.ManageRoles,
            dmPermission: false,
            cooldown: 5,
            dev: true,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder().setColor(0x242429).setTimestamp();
        await interaction.deferReply({ ephemeral: true });

        const subcommand = interaction.options.getSubcommand(true);

        switch (subcommand) {
            case "add": {
                const target = interaction.options.getUser("target", true);
                const content = interaction.options.getString("content", true);
                const anonymous =
                    interaction.options.getBoolean("anonymous") || false;
                const tagsRaw = interaction.options.getString("tags") || "";
                const tags = tagsRaw
                    .split(",")
                    .map((t) => t.trim().toLowerCase())
                    .filter((t) => t.length > 0);

                const note = new NoteModel({
                    usr: target.id,
                    id: target.id,
                    note: content,
                    createdAt: new Date(),
                    caseId: generateCaseId(),
                    moderatorId: anonymous ? null : interaction.user.id,
                    tags,
                });

                await note.save();

                embed.setDescription(
                    `📝 Note added for <@${target.id}> with ID \`${note.caseId}\`.\n` +
                        (tags.length
                            ? `**Tags:** ${tags
                                  .map((t) => `\`${t}\``)
                                  .join(", ")}`
                            : "") +
                        (anonymous ? "\n*Note was added anonymously.*" : "")
                );
                break;
            }

            case "remove": {
                const target = interaction.options.getUser("target", true);
                const noteId = interaction.options.getString("note-id", true);

                const note = await NoteModel.findOneAndDelete({
                    usr: target.id,
                    caseId: noteId,
                });

                if (!note) {
                    embed.setDescription(
                        `❌ No note found for <@${target.id}> with ID \`${noteId}\`.`
                    );
                    break;
                }

                embed.setDescription(
                    `🗑️ Note with ID \`${note.caseId}\` removed for <@${target.id}>.`
                );
                break;
            }

            case "list": {
                const target = interaction.options.getUser("target", true);
                const tag = interaction.options.getString("tag");
                const page = Math.max(
                    1,
                    interaction.options.getInteger("page") || 1
                );
                const PAGE_SIZE = 5;

                let query: any = { usr: target.id };
                if (tag) query.tags = tag.toLowerCase();

                const totalNotes = await NoteModel.countDocuments(query);
                const notes = await NoteModel.find(query)
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * PAGE_SIZE)
                    .limit(PAGE_SIZE);

                if (notes.length === 0) {
                    embed.setDescription(
                        tag
                            ? `No notes found for <@${target.id}> with tag \`${tag}\`.`
                            : `No notes found for <@${target.id}>.`
                    );
                    break;
                }

                embed.setTitle(
                    `Notes for <@${target.id}> (Page ${page}/${Math.ceil(
                        totalNotes / PAGE_SIZE
                    )})`
                );
                embed.setDescription(
                    notes
                        .map((n, i) =>
                            formatNote(n, (page - 1) * PAGE_SIZE + i)
                        )
                        .join("\n\n")
                );
                break;
            }

            case "clear": {
                const target = interaction.options.getUser("target", true);
                const confirm = interaction.options.getString("confirm", true);

                if (confirm !== "CONFIRM") {
                    embed.setDescription(
                        "⚠️ To clear all notes, you must type `CONFIRM` in the confirm field."
                    );
                    break;
                }

                const result = await NoteModel.deleteMany({ usr: target.id });
                embed.setDescription(
                    `🧹 Cleared **${result.deletedCount}** notes for <@${target.id}>.`
                );
                break;
            }

            case "search": {
                const keyword = interaction.options.getString("keyword", true);
                const limit = Math.max(
                    1,
                    Math.min(20, interaction.options.getInteger("limit") || 5)
                );

                const notes = await NoteModel.find({
                    note: { $regex: keyword, $options: "i" },
                })
                    .sort({ createdAt: -1 })
                    .limit(limit);

                if (notes.length === 0) {
                    embed.setDescription(
                        `No notes found containing \`${keyword}\`.`
                    );
                    break;
                }

                embed.setTitle(`Search results for \`${keyword}\``);
                embed.setDescription(
                    notes
                        .map(
                            (n, i) =>
                                `**User:** <@${n.usr}> | **ID:** \`${n.caseId}\`\n${n.note}`
                        )
                        .join("\n\n")
                );
                break;
            }

            case "stats": {
                const total = await NoteModel.countDocuments();
                const users = await NoteModel.distinct("usr");
                const topUsers = await NoteModel.aggregate([
                    { $group: { _id: "$usr", count: { $sum: 1 } } },
                    { $sort: { count: -1 } },
                    { $limit: 3 },
                ]);

                embed.setTitle("Moderation Notes Statistics");
                embed.setDescription(
                    [
                        `**Total notes:** ${total}`,
                        `**Users with notes:** ${users.length}`,
                        `**Top users:**`,
                        ...topUsers.map(
                            (u, i) =>
                                `\`${i + 1}.\` <@${u._id}> — **${
                                    u.count
                                }** notes`
                        ),
                    ].join("\n")
                );
                break;
            }
        }

        await interaction.editReply({ embeds: [embed] });
    }
}
