import {
    EmbedBuilder,
    Events,
    Guild,
    ChannelType,
    PermissionsBitField,
} from "discord.js";
import _Client from "@classes/_Client";
import Event from "@classes/Events";
import GuildConfig from "@schemas/GuildConfig";
import { v4 as uuidv4 } from "uuid";

export default class GuildCreate extends Event {
    constructor(client: _Client) {
        super(client, {
            name: Events.GuildCreate,
            description:
                "Triggered when the bot joins a new guild. Initializes configuration if not present. Also creates a category named 'Centil' with a text channel named 'global-announcement'.",
            once: false,
        });
    }

    async Execute(guild: Guild): Promise<void> {
        try {
            let config = await GuildConfig.findOne({ guildId: guild.id });

            if (!config) {
                const newUUID = uuidv4();
                config = await GuildConfig.create({
                    guildId: guild.id,
                    UUID: newUUID,
                });

                console.log(
                    `✅ Configuration created for guild: ${guild.name} (${guild.id}) with UUID: ${newUUID}`
                );
            } else {
                console.log(
                    `ℹ️ Configuration already exists for GUILD: ${guild.name} (${guild.id}) with UUID: ${config.UUID}`
                );
            }

            let embed = new EmbedBuilder()
                .setColor(0x242429)
                .setTitle("🤝 Thank You for Adding the Bot")
                .setDescription(
                    `Dear <@${guild.ownerId}>,\n\n` +
                        `Thank you for adding **${this.client.user?.username}** to your server: **${guild.name}**.\n` +
                        `We are truly delighted to be a part of your community.\n\n` +
                        `You may begin by using the \`/help\` command.\n` +
                        `For further assistance, please consult the documentation or reach out to our support team.\n\n` +
                        `Your server has now been configured and is ready to go.\n\n` +
                        `**Your guild ID:** \`${guild.id}\`\n` +
                        `**Your UUID:** \`${config.UUID}\`\n\n` +
                        `A category named \`Centil\` and a text channel named \`global-announcement\` were created.\n\n` +
                        `With appreciation,\nThe Team`
                );

            const owner = await guild.fetchOwner();
            if (owner) {
                await owner.send({ embeds: [embed] }).catch(() => {
                    console.warn(
                        `⚠️ Could not send welcome message to guild owner of ${guild.name} (${guild.id})`
                    );
                });
            }

            let category = guild.channels.cache.find(
                (ch) =>
                    ch.type === ChannelType.GuildCategory &&
                    ch.name === "Centil"
            );

            if (!category) {
                category = await guild.channels.create({
                    name: "Centil",
                    type: ChannelType.GuildCategory,
                });
            }

            let announcementChannel = guild.channels.cache.find(
                (ch) =>
                    ch.type === ChannelType.GuildText &&
                    ch.name === "global-announcement" &&
                    ch.parentId === category.id
            );

            if (!announcementChannel) {
                await guild.channels.create({
                    name: "global-announcement",
                    type: ChannelType.GuildText,
                    parent: category.id,
                    permissionOverwrites: [
                        {
                            id: guild.roles.everyone.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ],
                });
            }
        } catch (err) {
            console.error("❌ An error occurred during guild setup:", err);
        }
    }
}
