import {
    ChatInputCommandInteraction,
    AutocompleteInteraction,
} from "discord.js";
import Category from "@enums/Category";
import ICommand from "@interfaces/ICommand";
import ICommandOptions from "@interfaces/ICommandOptions";
import _Client from "@classes/_Client";

export default class Command implements ICommand {
    client: _Client;
    name: string;
    description: string;
    category: Category;
    options: ICommandOptions["options"]; 
    DefaultMemberPermissions: bigint;
    dmPermission: boolean;
    cooldown: number;
    dev: boolean;

    constructor(client: _Client, options: ICommandOptions) {
        this.client = client;
        this.name = options.name;
        this.description = options.description;
        this.category = options.category;
        this.options = options.options;
        this.DefaultMemberPermissions = options.DefaultMemberPermissions;
        this.dmPermission = options.dmPermission;
        this.cooldown = options.cooldown;
        this.dev = options.dev;
    }
    Execute(interaction: ChatInputCommandInteraction): void {}
    AutoComplete(interaction: AutocompleteInteraction): void {
        throw new Error("Method not implemented.");
    }
}
