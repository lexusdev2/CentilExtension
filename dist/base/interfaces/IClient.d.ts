import { Collection } from "discord.js";
import IConfig from "./IConfig";
import Command from "@classes/Command";
import { Riffy } from "riffy";
export default interface IClient {
    config: IConfig;
    Commands: Collection<string, Command>;
    subCommands: Collection<string, Command>;
    cooldown: Collection<string, Collection<string, number>>;
    developmentMode: boolean;
    riffy: Riffy;
    Init(): void;
    LoadHandlers(): void;
}
