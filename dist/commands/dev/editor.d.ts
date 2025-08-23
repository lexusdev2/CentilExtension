import _Client from "@classes/_Client";
import Command from "@classes/Command";
import { ChatInputCommandInteraction } from "discord.js";
export default class Editor extends Command {
    constructor(client: _Client);
    Execute(interaction: ChatInputCommandInteraction): Promise<void>;
}
