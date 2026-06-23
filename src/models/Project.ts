import mongoose, { Schema, Document, models } from "mongoose";

export interface IProject extends Document {
    creator_id: mongoose.Types.ObjectId;
    title: string;
    description: string;
    status: "Open" | "In-Progress" | "Completed";
    required_skills: string[];
    domain: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
    {
        creator_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: ["Open", "In-Progress", "Completed"],
            default: "Open",
        },
        required_skills: { type: [String], required: true },
        domain: { type: String, maxLength: 50, default: "General Tech" },
    },
    { timestamps: true }
);

export const Project = models.Project || mongoose.model<IProject>("Project", ProjectSchema);