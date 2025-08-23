import { model, Schema } from "mongoose";

interface Logging {
    usrTag?: string;
    usrName?: string;
    usrId?: string;

    stffTag?: string;
    stffName?: string;
    stffId?: string;

    action?: string;
    reason?: string;
    silent?: boolean;
    dm?: boolean;

    timestamp?: Date;
    channelId?: string;

    gldId?: string;
    gldName?: string;
    gldIcon?: string;

    expiresAt: Date;

    caseId: string;
}

export default Logging;

export const LoggingSchema = new Schema<Logging>({
    usrTag: { type: String, required: false },
    usrName: { type: String, required: false },
    usrId: { type: String, required: false },

    stffTag: { type: String, required: false },
    stffName: { type: String, required: false },
    stffId: { type: String, required: false },

    action: { type: String, required: false },
    reason: { type: String, required: false },
    silent: { type: Boolean, default: false },
    dm: { type: Boolean, default: true },

    timestamp: { type: Date, default: Date.now },
    channelId: { type: String, required: false },

    gldId: { type: String, required: false },
    gldName: { type: String, required: false },
    gldIcon: { type: String, required: false },

    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },

    caseId: { type: String, required: true },
});

export const LoggingModel = model<Logging>("Logging", LoggingSchema);
