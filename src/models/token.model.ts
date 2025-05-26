import { model, Schema } from "mongoose";
import { IToken } from "@/types/token";

const schema = new Schema<IToken>({
    token: { type: String, required: true },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    refreshedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Token = model("tokens", schema);
export default Token;
