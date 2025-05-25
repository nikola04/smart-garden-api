import { DeviceType, IDevice } from "@/types/device";
import { model, Schema } from "mongoose";

const schema = new Schema<IDevice>({
    name: {
        type: String,
        required: true,
        validate: {
            validator: (name: string): boolean => /^[a-zA-Z0-9_.-]{2,50}$/.test(name),
            message: "Invalid name. Name must be 2-50 characters long and can contain letters, numbers, underscores, hyphens, periods, or commas."
        },
        trim: true
    },
    deviceType: {
        type: String,
        enum: Object.values(DeviceType),
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
