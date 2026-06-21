import mongoose, { Schema, Document, models } from "mongoose";

export interface IApplication extends Document {
    project_id: mongoose.Types.ObjectId;
    applicant_id: mongoose.Types.ObjectId;
    status: "Pending" | "Accepted" | "Rejected";
    compatibility_score?: number; // AI-generated match percentage
    createdAt: Date;
    updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
    {
        project_id: { type: Schema.Types.ObjectId, ref: "Project", required: true },
        applicant_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["Pending", "Accepted", "Rejected"],
            default: "Pending",
        },
        compatibility_score: { type: Number },
    },
    { timestamps: true }
);

export const Application = models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);