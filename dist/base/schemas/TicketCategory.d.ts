import { Schema } from "mongoose";
declare const GuildSchema: Schema<any, import("mongoose").Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
    versionKey: true;
    safe: true;
    minimize: false;
    id: false;
    toJSON: {
        virtuals: true;
        versionKey: false;
        transform: (doc: import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
            id: string;
            ownerId: string;
            guildId: string;
            reason: string;
            claimerId: string;
        }>, {}> & import("mongoose").FlatRecord<{
            id: string;
            ownerId: string;
            guildId: string;
            reason: string;
            claimerId: string;
        }> & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }, ret: Record<string, any>) => Record<string, any>;
    };
}, {
    createdAt: NativeDate;
    updatedAt: NativeDate;
} & {
    id: string;
    ownerId: string;
    guildId: string;
    reason: string;
    claimerId: string;
}, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<{
    id: string;
    ownerId: string;
    guildId: string;
    reason: string;
    claimerId: string;
}>, {}> & import("mongoose").FlatRecord<{
    id: string;
    ownerId: string;
    guildId: string;
    reason: string;
    claimerId: string;
}> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export default GuildSchema;
