import mongoose from "mongoose";

export interface UserIF {
    username: String,
    password: String,
}

const userSchema = new mongoose.Schema<UserIF>({
    username: { type: String, required: true },
    password: { type: String, required: true },
});

export const User = mongoose.model<UserIF>('User', userSchema);


