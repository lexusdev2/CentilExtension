import { Guild } from "discord.js";
import _Client from "@classes/_Client";
import Event from "@classes/Events";
export default class GuildCreate extends Event {
    constructor(client: _Client);
    Execute(guild: Guild): Promise<void>;
}
