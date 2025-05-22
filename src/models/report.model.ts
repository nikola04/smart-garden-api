import { IReport } from "@/types/report";
import { model, Schema, Types } from "mongoose";

const schema = new Schema<IReport>({
    device: {
        type: Types.ObjectId,
        ref: "devices",
        required: true
    },
    reportedAt: { type: Date, default: Date.now }
});

const Report = model("reports", schema);
export default Report;
