export default class Logger {
    private static formatTimestamp;
    private static getColoredLabel;
    private static log;
    private static logwithouts;
    static ready(clientName?: string): void;
    static info(service: string, message: string): void;
    static error(service: string, message: string): void;
    static warn(service: string, message: string): void;
    static debug(service: string, message: string): void;
    static space(message: string): void;
}
