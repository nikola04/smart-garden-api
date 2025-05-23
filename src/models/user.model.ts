import { IUser } from "@/types/user";
import { model, Schema } from "mongoose";

const schema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = model("users", schema);
export default User;
