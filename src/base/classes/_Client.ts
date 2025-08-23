import { Client, Collection, GatewayIntentBits } from "discord.js";
import IConfig from "@interfaces/IConfig";
import IClient from "@interfaces/IClient";
import Handler from "@classes/Handler";
import Command from "@classes/Command";
import { connect } from "mongoose";
import { Riffy } from "riffy";
import { Spotify } from "riffy-spotify";

export default class _Client extends Client implements IClient {
    public config: IConfig;
    public handler: Handler;
    public Commands: Collection<string, Command>;
    public subCommands: Collection<string, Command>;
    public cooldown: Collection<string, Collection<string, number>>;
    public developmentMode: boolean;
    public riffy!: Riffy;

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildBans,
                GatewayIntentBits.GuildEmojisAndStickers,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildWebhooks,
                GatewayIntentBits.GuildInvites,
                GatewayIntentBits.GuildVoiceStates,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.GuildMessageTyping,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.DirectMessageReactions,
                GatewayIntentBits.DirectMessageTyping,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildScheduledEvents,
                GatewayIntentBits.AutoModerationConfiguration,
                GatewayIntentBits.AutoModerationExecution,
            ],
        });

        this.config = require(`${process.cwd()}/data/config.json`);
        this.handler = new Handler(this);
        this.Commands = new Collection();
        this.subCommands = new Collection();
        this.cooldown = new Collection();
        this.developmentMode = process.argv.slice(2).includes("--development");
    }

    public Init(): void {
        console.log(
            `Starting the bot on ${
                this.developmentMode ? "development" : "production"
            } mode...`
        );

        const spotify = new Spotify({
            clientId: this.config.spotify.clientId,
            clientSecret: this.config.spotify.clientSecret,
        });

        this.riffy = new Riffy(this, this.config.nodes, {
            send: (payload) => {
                const guild = this.guilds.cache.get(payload.d.guild_id);
                if (guild) guild.shard.send(payload);
            },
            defaultSearchPlatform: "ytmsearch",
            restVersion: "v4",
            plugins: [spotify as any],
        });

        this.riffy.on("nodeConnect", () => {
            console.log(`🟢 Riffy node connected.`);
        });

        this.riffy.on("nodeError", (_, error) => {
            console.error(`🔴 Error on Riffy node:`, error);
        });

        this.on("raw", (packet) => this.riffy.updateVoiceState(packet));

        this.once("ready", () => {
            this.riffy.init(this.user!.id);
            console.log(`🎵 Riffy initialized for user: ${this.user!.tag}`);
        });

        this.LoadHandlers();

        this.login(
            this.developmentMode ? this.config.DevToken : this.config.token
        ).catch((err) => {
            console.error("Failed to login: ", err);
        });

        connect(
            this.developmentMode
                ? this.config.devMongoUrl
                : this.config.mongoUrl
        )
            .then(() => console.log("Connected to MongoDB"))
            .catch((err) => console.error(err));
    }

    public LoadHandlers(): void {
        this.handler.LoadEvents();
        this.handler.LoadCommands();
    }
}
