import { model, Schema } from "mongoose";
import { IProject } from "@/types/project";

const schema = new Schema<IProject>({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true,
    },
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

const Project = model("projects", schema);
export default Project;
