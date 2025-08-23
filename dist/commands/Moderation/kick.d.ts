import { ChatInputCommandInteraction } from "discord.js";
import Command from "@classes/Command";
export default class Kick extends Command {
    constructor(client: any);
    Execute(interaction: ChatInputCommandInteraction): Promise<import("discord.js").InteractionResponse<boolean> | undefined>;
}
