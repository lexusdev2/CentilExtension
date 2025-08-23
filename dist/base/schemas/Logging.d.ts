import { Schema } from "mongoose";
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
export declare const LoggingSchema: Schema<Logging, import("mongoose").Model<Logging, any, any, any, import("mongoose").Document<unknown, any, Logging, any> & Logging & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Logging, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Logging>, {}> & import("mongoose").FlatRecord<Logging> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
export declare const LoggingModel: import("mongoose").Model<Logging, {}, {}, {}, import("mongoose").Document<unknown, {}, Logging, {}> & Logging & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
