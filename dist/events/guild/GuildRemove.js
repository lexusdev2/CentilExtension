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
const Events_1 = __importDefault(require("@classes/Events"));
const GuildConfig_1 = __importDefault(require("@schemas/GuildConfig"));
const discord_js_1 = require("discord.js");
class GuildRemove extends Events_1.default {
    constructor(client) {
        super(client, {
            name: discord_js_1.Events.GuildDelete,
            description: "Removes guild",
            once: false,
        });
    }
    Execute(guild) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const config = yield GuildConfig_1.default.findOne({ guildId: guild.id });
                if (!config) {
                    console.warn(`⚠️ No configuration found for guild: ${guild.name} (${guild.id})`);
                    return;
                }
                const category = guild.channels.cache.find((ch) => ch.type === discord_js_1.ChannelType.GuildCategory &&
                    ch.name === "Centil");
                if (category) {
                    yield category.delete().catch(() => { });
                }
                const announcementChannel = guild.channels.cache.find((ch) => ch.type === discord_js_1.ChannelType.GuildText &&
                    ch.name === "global-announcement" &&
                    ch.parentId === (category === null || category === void 0 ? void 0 : category.id));
                if (announcementChannel) {
                    yield announcementChannel.delete().catch(() => { });
                }
                yield GuildConfig_1.default.deleteOne({
                    guildId: guild.id,
                    UUID: config.UUID,
                });
                console.log(`🗑️ Configuration deleted for guild: ${guild.name} (${guild.id}) with UUID: ${config.UUID}`);
            }
            catch (err) {
                console.error("❌ Error removing guild configuration:", err);
            }
        });
    }
}
exports.default = GuildRemove;
