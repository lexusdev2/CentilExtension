import { LavalinkNode } from "riffy";
export default interface IConfig {
    token: string;
    discordClientId: string;
    guildId: string;
    mongoUrl: string;
    DevToken: string;
    DevDiscordClientId: string;
    DevGuildId: string;
    devUserId: string;
    devMongoUrl: string;
    spotify: {
        clientId: string;
        clientSecret: string;
    };
    nodes: LavalinkNode[];
}
