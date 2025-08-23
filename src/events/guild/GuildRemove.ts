import _Client from "@classes/_Client";
import Event from "@classes/Events";
import GuildConfig from "@schemas/GuildConfig";
import { Events, Guild, ChannelType } from "discord.js";

export default class GuildRemove extends Event {
    constructor(client: _Client) {
        super(client, {
            name: Events.GuildDelete,
            description: "Removes guild",
            once: false,
        });
    }

    async Execute(guild: Guild) {
        try {
            const config = await GuildConfig.findOne({ guildId: guild.id });

            if (!config) {
                console.warn(
                    `⚠️ No configuration found for guild: ${guild.name} (${guild.id})`
                );
                return;
            }

            const category = guild.channels.cache.find(
                (ch) =>
                    ch.type === ChannelType.GuildCategory &&
                    ch.name === "Centil"
            );
            if (category) {
                await category.delete().catch(() => {});
            }

            const announcementChannel = guild.channels.cache.find(
                (ch) =>
                    ch.type === ChannelType.GuildText &&
                    ch.name === "global-announcement" &&
                    ch.parentId === category?.id
            );
            if (announcementChannel) {
                await announcementChannel.delete().catch(() => {});
            }

            await GuildConfig.deleteOne({
                guildId: guild.id,
                UUID: config.UUID,
            });

            console.log(
                `🗑️ Configuration deleted for guild: ${guild.name} (${guild.id}) with UUID: ${config.UUID}`
            );
        } catch (err) {
            console.error("❌ Error removing guild configuration:", err);
        }
    }
}
