import { Client, Collection } from "discord.js";
import IConfig from "@interfaces/IConfig";
import IClient from "@interfaces/IClient";
import Handler from "@classes/Handler";
import Command from "@classes/Command";
import { Riffy } from "riffy";
export default class _Client extends Client implements IClient {
    config: IConfig;
    handler: Handler;
    Commands: Collection<string, Command>;
    subCommands: Collection<string, Command>;
    cooldown: Collection<string, Collection<string, number>>;
    developmentMode: boolean;
    riffy: Riffy;
    constructor();
    Init(): void;
    LoadHandlers(): void;
}
