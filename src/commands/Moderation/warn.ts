import {
    ChatInputCommandInteraction,
    PermissionsBitField,
    EmbedBuilder,
    //@ts-ignore
    ChannelType,
    //@ts-ignore
    GuildChannel,
    //@ts-ignore
    CategoryChannel,
} from "discord.js";
import Command from "@classes/Command";
import Category from "@enums/Category";
//@ts-ignore
import { LoggingModel } from "@schemas/Logging";
//@ts-ignore
import Types from "@enums/Types";

type WarningEntry = {
    usrTag: string;
    usrName: string;
    usrId: string;
    stffTag: string;
    stffName: string;
    stffId: string;
    action: string;
    reason: string;
    silent: boolean;
    dm: boolean;
    timestamp: Date;
    channelId: string;
    gldId: string;
    gldName: string;
    gldIcon?: string;
    expiresAt?: Date;
    caseId?: string;
};

function generateCaseId(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export default class Warn extends Command {
    constructor(client: any) {
        super(client, {
            name: "warn",
            description:
                "Provides an advanced warning mechanism for server moderation.",
            category: Category.Moderation,
            options: [
                {
                    name: "issue",
                    description: "Issue a formal warning to a specified user.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "target",
                            description:
                                "Select the user to receive the warning.",
                            type: Types.User,
                            required: true,
                        },
                        {
                            name: "reason",
                            description: "Specify the reason for the warning.",
                            type: Types.String,
                            required: false,
                        },
                        {
                            name: "silent",
                            description:
                                "Determine whether the warning should be logged silently, without public notification.",
                            type: Types.Boolean,
                            required: false,
                        },
                        {
                            name: "duration",
                            description:
                                "Define the duration of the warning (e.g., 7d, 1h). Leave blank for an indefinite warning.",
                            type: Types.String,
                            required: false,
                        },
                    ],
                },
                {
                    name: "revoke",
                    description:
                        "Revoke a previously issued warning using its case ID.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "caseid",
                            description:
                                "Specify the case ID of the warning to revoke.",
                            type: Types.String,
                            required: true,
                        },
                        {
                            name: "reason",
                            description:
                                "Provide a justification for revoking the warning.",
                            type: Types.String,
                            required: false,
                        },
                    ],
                },
                {
                    name: "history",
                    description:
                        "Display a comprehensive warning history for a specific user.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "target",
                            description:
                                "Select the user whose warning history should be displayed.",
                            type: Types.User,
                            required: true,
                        },
                        {
                            name: "includeexpired",
                            description:
                                "Determine whether expired warnings should be included in the results.",
                            type: Types.Boolean,
                            required: false,
                        },
                    ],
                },
                {
                    name: "details",
                    description:
                        "Retrieve detailed information about a specific warning case.",
                    type: Types.SubCommand,
                    options: [
                        {
                            name: "caseid",
                            description:
                                "Specify the case ID for which detailed information is required.",
                            type: Types.String,
                            required: true,
                        },
                    ],
                },
            ],
            DefaultMemberPermissions: PermissionsBitField.Flags.ManageRoles,
            dmPermission: false,
            cooldown: 5,
            dev: false,
        });
    }

    async Execute(interaction: ChatInputCommandInteraction) {
        //@ts-ignore
        const embed = new EmbedBuilder().setColor(0x242429).setTimestamp();
        await interaction.deferReply({ ephemeral: true });

        //@ts-ignore
        const subcommand = interaction.options.getSubcommand(true);

        switch (subcommand) {
            case "issue": {
                const target = interaction.options.getUser("target", true);
                const reason =
                    interaction.options.getString("reason") ||
                    "No reason was provided.";
                const silent =
                    interaction.options.getBoolean("silent") ?? false;
                const duration = interaction.options.getString("duration");
                let expiresAt: Date | undefined = undefined;

                if (duration) {
                    const match = duration.match(/^(\d+)([dhms])$/i);
                    if (match) {
                        const value = parseInt(match[1]);
                        const unit = match[2].toLowerCase();
                        const now = Date.now();
                        let ms = 0;
                        if (unit === "d") ms = value * 24 * 60 * 60 * 1000;
                        if (unit === "h") ms = value * 60 * 60 * 1000;
                        if (unit === "m") ms = value * 60 * 1000;
                        if (unit === "s") ms = value * 1000;
                        expiresAt = new Date(now + ms);
                    }
                }

                const caseId = generateCaseId();

                const entry: WarningEntry = {
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
                    gldId: interaction.guild?.id!,
                    gldName: interaction.guild?.name!,
                    gldIcon: interaction.guild?.iconURL() || undefined,
                    expiresAt,
                    caseId,
                };
                await LoggingModel.create(entry);

                embed
                    .setTitle("Warning Issued")
                    .setDescription(
                        `**User:** ${target.tag} (${
                            target.id
                        })\n**Moderator:** ${
                            interaction.user.tag
                        }\n**Reason:** ${reason}\n**Silent:** ${
                            silent ? "Yes" : "No"
                        }\n**Case ID:** \`${caseId}\`\n**Expires:** ${
                            expiresAt
                                ? `<t:${Math.floor(
                                      expiresAt.getTime() / 1000
                                  )}:R>`
                                : "Never"
                        }`
                    );
                break;
            }
            case "revoke": {
                const caseId = interaction.options.getString("caseid", true);
                const reason =
                    interaction.options.getString("reason") ||
                    "No reason was provided.";

                const log = await LoggingModel.findOneAndDelete({
                    caseId,
                    gldId: interaction.guild?.id,
                    action: "warn",
                });

                if (log) {
                    embed
                        .setTitle("Warning Revoked")
                        .setDescription(
                            `**User:** ${log.usrTag} (${log.usrId})\n**Moderator:** ${interaction.user.tag}\n**Case ID:** \`${caseId}\`\n**Reason:** ${reason}`
                        );
                } else {
                    embed
                        .setTitle("Warning Not Found")
                        .setDescription(
                            `No record of a warning with the case ID \`${caseId}\` was found in this server.`
                        );
                }
                break;
            }
            case "history": {
                const target = interaction.options.getUser("target", true);
                const includeExpired =
                    interaction.options.getBoolean("includeexpired") ?? false;

                const now = new Date();
                const query: any = {
                    usrId: target.id,
                    gldId: interaction.guild?.id,
                    action: "warn",
                };
                if (!includeExpired) {
                    query["$or"] = [
                        { expiresAt: { $exists: false } },
                        { expiresAt: { $gt: now } },
                    ];
                }

                const logs = (await LoggingModel.find(query)
                    .sort({ timestamp: -1 })
                    .lean()) as WarningEntry[];

                if (logs.length === 0) {
                    embed
                        .setTitle("No Warnings Found")
                        .setDescription(
                            `There are no recorded warnings for ${target.tag} in this server.`
                        );
                } else {
                    embed
                        .setTitle(`Warning History: ${target.tag}`)
                        .setDescription(
                            logs
                                .map(
                                    (log, i) =>
                                        `**#${i + 1}** — Case: \`${
                                            log.caseId
                                        }\`\nReason: ${
                                            log.reason || "No reason provided"
                                        }\nModerator: ${
                                            log.stffTag
                                        }\nIssued: <t:${Math.floor(
                                            (log.timestamp?.getTime() || 0) /
                                                1000
                                        )}:R>\nExpires: ${
                                            log.expiresAt
                                                ? `<t:${Math.floor(
                                                      new Date(
                                                          log.expiresAt
                                                      ).getTime() / 1000
                                                  )}:R>`
                                                : "Never"
                                        }`
                                )
                                .join("\n\n")
                        );
                }
                break;
            }
            case "details": {
                const caseId = interaction.options.getString("caseid", true);

                const log = await LoggingModel.findOne({
                    caseId,
                    gldId: interaction.guild?.id,
                    action: "warn",
                });

                if (!log) {
                    embed
                        .setTitle("Warning Not Found")
                        .setDescription(
                            `No warning record with the case ID \`${caseId}\` was found in this server.`
                        );
                } else {
                    embed
                        .setTitle(`Warning Details — Case ID: ${caseId}`)
                        .setDescription(
                            `**User:** ${log.usrTag} (${
                                log.usrId
                            })\n**Moderator:** ${log.stffTag}\n**Reason:** ${
                                log.reason
                            }\n**Issued:** <t:${Math.floor(
                                (log.timestamp?.getTime() || 0) / 1000
                            )}:F>\n**Expires:** ${
                                log.expiresAt
                                    ? `<t:${Math.floor(
                                          new Date(log.expiresAt).getTime() /
                                              1000
                                      )}:F>`
                                    : "Never"
                            }\n**Silent:** ${log.silent ? "Yes" : "No"}`
                        );
                }
                break;
            }
        }

        await interaction.editReply({ embeds: [embed] });
        return;
    }
}
