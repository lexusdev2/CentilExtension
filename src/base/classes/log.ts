import chalk from "chalk";
import dayjs from "dayjs";
import { readFileSync } from "fs";
import { join } from "path";

type LogLevel = "READY" | "INFO" | "ERROR" | "WARN" | "DEBUG";

export default class Logger {
    private static formatTimestamp(): string {
        return dayjs().format("HH:mm:ss");
    }

    private static getColoredLabel(level: LogLevel): string {
        const label = level.padEnd(6, " ");
        switch (level) {
            case "READY":
                return chalk.bgGreen.black(` ${label} `);
            case "INFO":
                return chalk.bgBlue.white(` ${label} `);
            case "ERROR":
                return chalk.bgRed.white(` ${label} `);
            case "WARN":
                return chalk.bgYellow.black(` ${label} `);
            case "DEBUG":
                return chalk.bgMagenta.white(` ${label} `);
            default:
                return ` ${label} `;
        }
    }

    private static log(level: LogLevel, service: string, message: string) {
        const label = Logger.getColoredLabel(level);
        const timestamp = Logger.formatTimestamp();

        // Pad service name to fixed width for alignment
        const serviceName = chalk.cyan(service.padEnd(15, " "));

        const time = chalk.gray(timestamp);
        const grayMessage = chalk.gray(message);

        // Compose log line with aligned columns
        console.log(`${label} ${serviceName} ${time} : ${grayMessage}`);
    }

    private static logwithouts(message: string) {
        const terminalWidth = process.stdout.columns || 80;
        const plainMessage = message.trim();
        const padding = Math.max(
            0,
            Math.floor((terminalWidth - plainMessage.length) / 2)
        );
        const centeredMessage = " ".repeat(padding) + plainMessage;
        const styledMessage = chalk.blue.bold(centeredMessage);
        const border = chalk.blue.bold("─".repeat(terminalWidth));

        console.log(border);
        console.log(styledMessage);
        console.log(border);
    }

    static ready(clientName: string = "UnknownClient") {
        const fullTimestamp = new Date().toISOString();
        let packageName = "Unknown";
        let packageVersion = "0.0.0";

        try {
            const pkg = JSON.parse(
                readFileSync(join(process.cwd(), "package.json"), "utf-8")
            );
            packageName = pkg.name || "Unknown";
            packageVersion = pkg.version || "0.0.0";
        } catch (err) {
            console.warn("⚠️ Failed to read package.json:", err);
        }

        const message = `Starting ${chalk.greenBright(
            `${packageName}@${packageVersion}`
        )} - ${chalk.cyan(clientName)} : ${chalk.gray(fullTimestamp)}`;
        Logger.log("READY", "Centil", message);
    }

    static info(service: string, message: string) {
        Logger.log("INFO", service, message);
    }

    static error(service: string, message: string) {
        Logger.log("ERROR", service, message);
    }

    static warn(service: string, message: string) {
        Logger.log("WARN", service, message);
    }

    static debug(service: string, message: string) {
        Logger.log("DEBUG", service, message);
    }

    static space(message: string) {
        Logger.logwithouts(message);
    }
}

module.exports = Logger;
