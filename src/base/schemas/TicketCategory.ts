import { model, Schema } from "mongoose";

const GuildSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
        },
        guildId: {
            type: String,
            required: true,
        },
        ownerId: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
            default: null,
        },
        claimerId: {
            type: String,
            default: null,
        }
    }, {
        timestamps: true,
        versionKey: true,
        safe: true,
        minimize: false,
        id: false,
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (doc, ret) => {
                delete ret._id;
                return ret;
            },
        },
    }
)

module.exports = model("GuildSchema", GuildSchema);
export default GuildSchema;