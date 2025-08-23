"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Events_1 = __importDefault(require("@classes/Events"));
const GuildConfig_1 = __importDefault(require("@schemas/GuildConfig"));
const uuid_1 = require("uuid");
class GuildCreate extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.GuildCreate,
            description: "Triggered when the bot joins a new guild. Initializes configuration if not present. Also creates a category named 'Centil' with a text channel named 'global-announcement'.",
            once: false,
        });
    }
    Execute(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let config = yield GuildConfig_1.default.findOne({ guildId: guild.id });
                if (!config) {
                    const newUUID = (0, uuid_1.v4)();
                    config = yield GuildConfig_1.default.create({
                        guildId: guild.id,
                        UUID: newUUID,
                    });
                    console.log(`✅ Configuration created for guild: ${guild.name} (${guild.id}) with UUID: ${newUUID}`);
                }
                else {
                    console.log(`ℹ️ Configuration already exists for GUILD: ${guild.name} (${guild.id}) with UUID: ${config.UUID}`);
                }
                let embed = new discord_js_1.EmbedBuilder()
                    .setColor(0x242429)
                    .setTitle("🤝 Thank You for Adding the Bot")
                    .setDescription(`Dear <@${guild.ownerId}>,\n\n` +
                    `Thank you for adding **${(_a = this.client.user) === null || _a === void 0 ? void 0 : _a.username}** to your server: **${guild.name}**.\n` +
                    `We are truly delighted to be a part of your community.\n\n` +
                    `You may begin by using the \`/help\` command.\n` +
                    `For further assistance, please consult the documentation or reach out to our support team.\n\n` +
                    `Your server has now been configured and is ready to go.\n\n` +
                    `**Your guild ID:** \`${guild.id}\`\n` +
                    `**Your UUID:** \`${config.UUID}\`\n\n` +
                    `A category named \`Centil\` and a text channel named \`global-announcement\` were created.\n\n` +
                    `With appreciation,\nThe Team`);
                const owner = yield guild.fetchOwner();
                if (owner) {
                    yield owner.send({ embeds: [embed] }).catch(() => {
                        console.warn(`⚠️ Could not send welcome message to guild owner of ${guild.name} (${guild.id})`);
                    });
                }
                let category = guild.channels.cache.find((ch) => ch.type === discord_js_1.ChannelType.GuildCategory &&
                    ch.name === "Centil");
                if (!category) {
                    category = yield guild.channels.create({
                        name: "Centil",
                        type: discord_js_1.ChannelType.GuildCategory,
                    });
                }
                let announcementChannel = guild.channels.cache.find((ch) => ch.type === discord_js_1.ChannelType.GuildText &&
                    ch.name === "global-announcement" &&
                    ch.parentId === category.id);
                if (!announcementChannel) {
                    yield guild.channels.create({
                        name: "global-announcement",
                        type: discord_js_1.ChannelType.GuildText,
                        parent: category.id,
                        permissionOverwrites: [
                            {
                                id: guild.roles.everyone.id,
                                allow: [discord_js_1.PermissionsBitField.Flags.ViewChannel],
                            },
                        ],
                    });
                }
            }
            catch (err) {
                console.error("❌ An error occurred during guild setup:", err);
            }
        });
    }
}
exports.default = GuildCreate;
