import { ChatInputCommandInteraction } from "discord.js";
import Command from "@classes/Command";
export default class Skip extends Command {
    constructor(client: any);
    Execute(interaction: ChatInputCommandInteraction): Promise<import("discord.js").Message<boolean>>;
}
