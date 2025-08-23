import { Collection, Events, REST, Routes } from "discord.js";
import chalk from "chalk";
import Command from "../../base/classes/Command";
import Event from "../../base/classes/Events";
import _Client from "../../base/classes/_Client";
import Logger from "@classes/log";

const stripAnsi = (str: string) =>
    str.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");
const pad = (str: string, len: number) => {
    const visible = stripAnsi(str);
    return visible.length > len
        ? visible.slice(0, len - 1) + "…"
        : str + " ".repeat(len - visible.length);
};

export default class Ready extends Event {
    constructor(client: _Client) {
        super(client, {
            name: Events.ClientReady,
            description:
                "Event triggered when the Discord client has successfully initialized.",
            once: true,
        });
    }

    async Execute(...args: any[]) {
        console.clear();

        const [client] = args;
        const clientId = this.client.developmentMode
            ? this.client.config.DevDiscordClientId
            : this.client.config.discordClientId;

        const rest = new REST().setToken(
            this.client.developmentMode
                ? this.client.config.DevToken
                : this.client.config.token
        );
        let registeredCommands: any[] = [];
        let statusColor = "🟩";
        let statusMessage = "Operational";
        let registrationMessage = "";

        try {
            if (this.client.developmentMode) {
                registeredCommands = (await rest.put(
                    Routes.applicationGuildCommands(
                        clientId,
                        this.client.config.DevGuildId
                    ),
                    {
                        body: this.GetJson(
                            this.client.Commands.filter((cmd) => cmd.dev)
                        ),
                    }
                )) as any[];

                registrationMessage = `✅ Successfully registered ${
                    registeredCommands.length
                } development command${
                    registeredCommands.length !== 1 ? "s" : ""
                }.`;
            } else {
                registeredCommands = (await rest.put(
                    Routes.applicationCommands(clientId),
                    {
                        body: this.GetJson(
                            this.client.Commands.filter((cmd) => !cmd.dev)
                        ),
                    }
                )) as any[];

                registrationMessage = `✅ Successfully registered ${
                    registeredCommands.length
                } global command${registeredCommands.length !== 1 ? "s" : ""}.`;
            }

            if (
                registeredCommands.some(
                    (c: any) =>
                        c.description === "Deprecated" ||
                        c.name.startsWith("test")
                )
            ) {
                statusColor = "🟨";
                statusMessage = "Warnings Detected";
            }
        } catch (err) {
            statusColor = "🟥";
            statusMessage = "Initialization Failed";
            registrationMessage = `❌ Command registration encountered an error: ${err}`;
        }

        Logger.space("CLIENT ");

        this.PrintCommandTable(registeredCommands);
        if (this.client.developmentMode) {
            this.PrintDevCommandTable(registeredCommands);
        }

        console.log("\n" + chalk.greenBright(registrationMessage));
        console.log(
            chalk.bold(
                `\n🧠 Operational Status: ${statusColor} ${statusMessage}\n`
            )
        );
        console.log(
            chalk.cyanBright(`✅ Bot is now running as ${client.user.tag}`)
        );
    }

    private GetJson(commands: Collection<string, Command>): object[] {
        const data: object[] = [];

        commands.forEach((command) => {
            data.push({
                name: command.name,
                description: command.description,
                options: command.options ?? [],
                default_member_permissions:
                    command.DefaultMemberPermissions?.toString() ?? "None",
                dm_permission: command.dmPermission ?? true,
            });
        });

        return data;
    }

    private PrintCommandTable(commands: object[]) {
        const headers = [
            "Name",
            "Description",
            "Options",
            "Permissions",
            "DM Allowed",
            "Status",
        ];
        const colWidths = [15, 40, 10, 15, 12, 24];

        const headerRow = `| ${pad(headers[0], colWidths[0])} | ${pad(
            headers[1],
            colWidths[1]
        )} | ${pad(headers[2], colWidths[2])} | ${pad(
            headers[3],
            colWidths[3]
        )} | ${pad(headers[4], colWidths[4])} | ${pad(
            headers[5],
            colWidths[5]
        )} |`;
        const separatorRow = `|${"-".repeat(colWidths[0] + 2)}|${"-".repeat(
            colWidths[1] + 2
        )}|${"-".repeat(colWidths[2] + 2)}|${"-".repeat(
            colWidths[3] + 2
        )}|${"-".repeat(colWidths[4] + 2)}|${"-".repeat(colWidths[5] + 2)}|`;

        const rows = commands.map((cmd: any) => {
            let statusIcon = "🟩";
            let statusText = chalk.green("Valid");

            if (!cmd.name || !cmd.description) {
                statusIcon = "🟥";
                statusText = chalk.red("Error: Invalid Entry");
            } else if (
                cmd.description === "Deprecated" ||
                cmd.name.startsWith("test")
            ) {
                statusIcon = "🟨";
                statusText = chalk.yellow("Warning: Review Suggested");
            }

            return `| ${pad(cmd.name, colWidths[0])} | ${pad(
                cmd.description,
                colWidths[1]
            )} | ${pad(String(cmd.options?.length ?? 0), colWidths[2])} | ${pad(
                cmd.default_member_permissions ?? "None",
                colWidths[3]
            )} | ${pad(
                String(cmd.dm_permission ?? true),
                colWidths[4]
            )} | ${pad(`${statusIcon} ${statusText}`, colWidths[5])} |`;
        });

        console.log(
            "\n" +
                chalk.bold(
                    chalk.cyanBright("📋 Registered Application Commands")
                )
        );
        console.log(separatorRow);
        console.log(chalk.bold(headerRow));
        console.log(separatorRow);
        rows.forEach((row) => console.log(row));
        console.log(separatorRow);
    }

    private PrintDevCommandTable(commands: object[]) {
        const devCommands = commands.filter(
            (cmd: any) =>
                cmd.name?.startsWith("dev") || cmd.name?.includes("test")
        );
        if (devCommands.length === 0) return;

        const headers = ["Dev Command", "Description"];
        const colWidths = [25, 60];
        const headerRow = `| ${pad(headers[0], colWidths[0])} | ${pad(
            headers[1],
            colWidths[1]
        )} |`;
        const separatorRow = `|${"-".repeat(colWidths[0] + 2)}|${"-".repeat(
            colWidths[1] + 2
        )}|`;

        console.log(
            "\n" +
                chalk.bold(chalk.yellowBright("🛠️ Development-only Commands"))
        );
        console.log(separatorRow);
        console.log(chalk.bold(headerRow));
        console.log(separatorRow);

        devCommands.forEach((cmd: any) => {
            const row = `| ${pad(cmd.name, colWidths[0])} | ${pad(
                cmd.description || "No description provided.",
                colWidths[1]
            )} |`;
            console.log(row);
        });

        console.log(separatorRow);
    }
}
