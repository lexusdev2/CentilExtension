"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Handler_1 = __importDefault(require("@classes/Handler"));
const mongoose_1 = require("mongoose");
const riffy_1 = require("riffy");
const riffy_spotify_1 = require("riffy-spotify");
class _Client extends discord_js_1.Client {
    constructor() {
        super({
            intents: [
                discord_js_1.GatewayIntentBits.Guilds,
                discord_js_1.GatewayIntentBits.GuildMembers,
                discord_js_1.GatewayIntentBits.GuildBans,
                discord_js_1.GatewayIntentBits.GuildEmojisAndStickers,
                discord_js_1.GatewayIntentBits.GuildIntegrations,
                discord_js_1.GatewayIntentBits.GuildWebhooks,
                discord_js_1.GatewayIntentBits.GuildInvites,
                discord_js_1.GatewayIntentBits.GuildVoiceStates,
                discord_js_1.GatewayIntentBits.GuildPresences,
                discord_js_1.GatewayIntentBits.GuildMessages,
                discord_js_1.GatewayIntentBits.GuildMessageReactions,
                discord_js_1.GatewayIntentBits.GuildMessageTyping,
                discord_js_1.GatewayIntentBits.DirectMessages,
                discord_js_1.GatewayIntentBits.DirectMessageReactions,
                discord_js_1.GatewayIntentBits.DirectMessageTyping,
                discord_js_1.GatewayIntentBits.MessageContent,
                discord_js_1.GatewayIntentBits.GuildScheduledEvents,
                discord_js_1.GatewayIntentBits.AutoModerationConfiguration,
                discord_js_1.GatewayIntentBits.AutoModerationExecution,
            ],
        });
        this.config = require(`${process.cwd()}/data/config.json`);
        this.handler = new Handler_1.default(this);
        this.Commands = new discord_js_1.Collection();
        this.subCommands = new discord_js_1.Collection();
        this.cooldown = new discord_js_1.Collection();
        this.developmentMode = process.argv.slice(2).includes("--development");
    }
    Init() {
        console.log(`Starting the bot on ${this.developmentMode ? "development" : "production"} mode...`);
        const spotify = new riffy_spotify_1.Spotify({
            clientId: this.config.spotify.clientId,
            clientSecret: this.config.spotify.clientSecret,
        });
        this.riffy = new riffy_1.Riffy(this, this.config.nodes, {
            send: (payload) => {
                const guild = this.guilds.cache.get(payload.d.guild_id);
                if (guild)
                    guild.shard.send(payload);
            },
            defaultSearchPlatform: "ytmsearch",
            restVersion: "v4",
            plugins: [spotify],
        });
        this.riffy.on("nodeConnect", () => {
            console.log(`🟢 Riffy node connected.`);
        });
        this.riffy.on("nodeError", (_, error) => {
            console.error(`🔴 Error on Riffy node:`, error);
        });
        this.on("raw", (packet) => this.riffy.updateVoiceState(packet));
        this.once("ready", () => {
            this.riffy.init(this.user.id);
            console.log(`🎵 Riffy initialized for user: ${this.user.tag}`);
        });
        this.LoadHandlers();
        this.login(this.developmentMode ? this.config.DevToken : this.config.token).catch((err) => {
            console.error("Failed to login: ", err);
        });
        (0, mongoose_1.connect)(this.developmentMode
            ? this.config.devMongoUrl
            : this.config.mongoUrl)
            .then(() => console.log("Connected to MongoDB"))
            .catch((err) => console.error(err));
    }
    LoadHandlers() {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
    }
}
exports.default = _Client;
