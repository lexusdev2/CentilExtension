import { Events } from "discord.js";
import _Client from "@classes/_Client";
export default interface IEvent {
    client: _Client;
    name: Events;
    description: string;
    once?: boolean;
}
