import { ChatInputCommandInteraction } from "discord.js";
import Command from "@classes/Command";
export default class Note extends Command {
    constructor(client: any);
    Execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
