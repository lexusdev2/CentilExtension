import _Client from "@classes/_Client";
import Event from "@classes/Events";
import { Guild } from "discord.js";
export default class GuildRemove extends Event {
    constructor(client: _Client);
    Execute(guild: Guild): Promise<void>;
}
