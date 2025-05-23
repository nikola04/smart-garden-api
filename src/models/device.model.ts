import { IDevice } from "@/types/device";
import { model, Schema } from "mongoose";

const schema = new Schema<IDevice>({
    name: String,
    deviceType: {
        type: String,
        enum: ["ESP32"],
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    addedAt: { type: Date, default: Date.now }
});

const Device = model("devices", schema);
export default Device;
