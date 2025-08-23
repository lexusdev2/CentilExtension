import { Document } from "mongoose";
export interface IUser extends Document {
    id: string;
    username: string;
    avatarHash: string | null;
    accessToken: string;
    refreshToken: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser, {}> & IUser & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default User;
