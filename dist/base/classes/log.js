"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const dayjs_1 = __importDefault(require("dayjs"));
const fs_1 = require("fs");
const path_1 = require("path");
class Logger {
    static formatTimestamp() {
        return (0, dayjs_1.default)().format("HH:mm:ss");
    }
    static getColoredLabel(level) {
        const label = level.padEnd(6, " ");
        switch (level) {
            case "READY":
                return chalk_1.default.bgGreen.black(` ${label} `);
            case "INFO":
                return chalk_1.default.bgBlue.white(` ${label} `);
            case "ERROR":
                return chalk_1.default.bgRed.white(` ${label} `);
            case "WARN":
                return chalk_1.default.bgYellow.black(` ${label} `);
            case "DEBUG":
                return chalk_1.default.bgMagenta.white(` ${label} `);
            default:
                return ` ${label} `;
        }
    }
    static log(level, service, message) {
        const label = Logger.getColoredLabel(level);
        const timestamp = Logger.formatTimestamp();
        // Pad service name to fixed width for alignment
        const serviceName = chalk_1.default.cyan(service.padEnd(15, " "));
        const time = chalk_1.default.gray(timestamp);
        const grayMessage = chalk_1.default.gray(message);
        // Compose log line with aligned columns
        console.log(`${label} ${serviceName} ${time} : ${grayMessage}`);
    }
    static logwithouts(message) {
        const terminalWidth = process.stdout.columns || 80;
        const plainMessage = message.trim();
        const padding = Math.max(0, Math.floor((terminalWidth - plainMessage.length) / 2));
        const centeredMessage = " ".repeat(padding) + plainMessage;
        const styledMessage = chalk_1.default.blue.bold(centeredMessage);
        const border = chalk_1.default.blue.bold("─".repeat(terminalWidth));
        console.log(border);
        console.log(styledMessage);
        console.log(border);
    }
    static ready(clientName = "UnknownClient") {
        const fullTimestamp = new Date().toISOString();
        let packageName = "Unknown";
        let packageVersion = "0.0.0";
        try {
            const pkg = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(process.cwd(), "package.json"), "utf-8"));
            packageName = pkg.name || "Unknown";
            packageVersion = pkg.version || "0.0.0";
        }
        catch (err) {
            console.warn("⚠️ Failed to read package.json:", err);
        }
        const message = `Starting ${chalk_1.default.greenBright(`${packageName}@${packageVersion}`)} - ${chalk_1.default.cyan(clientName)} : ${chalk_1.default.gray(fullTimestamp)}`;
        Logger.log("READY", "Centil", message);
    }
    static info(service, message) {
        Logger.log("INFO", service, message);
    }
    static error(service, message) {
        Logger.log("ERROR", service, message);
    }
    static warn(service, message) {
        Logger.log("WARN", service, message);
    }
    static debug(service, message) {
        Logger.log("DEBUG", service, message);
    }
    static space(message) {
        Logger.logwithouts(message);
    }
}
exports.default = Logger;
module.exports = Logger;
