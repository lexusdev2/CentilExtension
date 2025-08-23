import { ChatInputCommandInteraction } from "discord.js";
import Command from "@classes/Command";
export default class Loop extends Command {
    constructor(client: any);
    Execute(interaction: ChatInputCommandInteraction): Promise<import("discord.js").Message<boolean>>;
}
