import Command from "@classes/Command";
import { ChatInputCommandInteraction } from "discord.js";
export default class Queue extends Command {
    constructor(client: any);
    Execute(interaction: ChatInputCommandInteraction): Promise<import("discord.js").Message<boolean>>;
}
