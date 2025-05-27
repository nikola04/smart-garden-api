import { IReport } from "@/types/report";
import { model, Schema, Types } from "mongoose";

const schema = new Schema<IReport>({
    device: {
        type: Types.ObjectId,
        ref: "devices",
        required: true
    },
    air: {
        temperature: { type: Number, required: true },
        humidity: { type: Number, required: true }
    },
    soil: {
        moisture: { type: Number, required: true },
        sensors_used: { type: Number, required: true }
    },
    light: {
        value: { type: Number, required: true },
        night: { type: Boolean, required: true }
    },
    battery: {
        level: { type: Number, required: true },
        voltage: { type: Number, required: true }
    },
    charger: {
        voltage: { type: Number, required: true },
        current: { type: Number, required: true },
        charging: { type: Boolean, required: true }
    },
    reportedAt: { type: Date, default: Date.now }
});

const Report = model("reports", schema);
export default Report;
