import { ChatInputCommandInteraction } from "discord.js";
import Command from "@classes/Command";
export default class Purge extends Command {
    constructor(client: any);
    Execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
