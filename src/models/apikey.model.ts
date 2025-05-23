import { model, Schema } from "mongoose";
import { IAPIKey } from "@/types/apikey";

const schema = new Schema<IAPIKey>({
    key: { type: String, required: true },
    device: {
        type: Schema.Types.ObjectId,
        ref: "devices",
        required: true
    },
    expiresAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
});

const APIKey = model("api_keys", schema);
export default APIKey;
