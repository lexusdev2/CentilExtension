interface IGuildConfig {
    guildId: string;
    UUID: string;
    logs: {
        moderation: {
            enabled: boolean;
            channelId: string;
        };
    };
}
declare const _default: import("mongoose").Model<IGuildConfig, {}, {}, {}, import("mongoose").Document<unknown, {}, IGuildConfig, {}> & IGuildConfig & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default _default;
