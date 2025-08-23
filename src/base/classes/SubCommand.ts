import {
    AutocompleteInteraction,
    CacheType,
    ChatInputCommandInteraction,
} from "discord.js";
import ISubCommand from "@interfaces/ISubCommands";
import _Client from "@classes/_Client";
import Category from "@enums/Category";

export default class SubCommand implements ISubCommand {
    name: string;
    category?: Category | undefined;
    options?: object | undefined;
    DefaultMemberPermissions?: bigint | undefined;
    dmPermission?: boolean | undefined;
    cooldown?: number | undefined;

    constructor(client: _Client, options: ISubCommand) {
        this.name = options.name;
    }

    Execute(interaction: ChatInputCommandInteraction<CacheType>): void {}

    AutoComplete?(interaction: AutocompleteInteraction): void;
}
