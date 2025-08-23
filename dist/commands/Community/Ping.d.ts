import { ChatInputCommandInteraction } from "discord.js";
import Command from "@classes/Command";
export default class Ping extends Command {
    constructor(client: any);
    Execute(interaction: ChatInputCommandInteraction): void;
}
