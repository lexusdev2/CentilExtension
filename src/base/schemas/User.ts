import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  id: string;
  username: string;
  avatarHash: string | null;
  accessToken: string;
  refreshToken: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    id: { type: String, required: true },
    username: { type: String, required: true },
    avatarHash: { type: String, default: null },
    accessToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
export default User;
