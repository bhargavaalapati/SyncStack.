import mongoose, { Schema, Document, models } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    image?: string;
    branch?: string;
    graduation_year?: number;
    tech_skills: string[];
    github_url?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        image: { type: String },
        branch: { type: String },
        graduation_year: { type: Number },
        tech_skills: { type: [String], default: [] },
        github_url: { type: String },
    },
    { timestamps: true }
);

// Prevent mongoose from recompiling the model upon hot-reload
export const User = models.User || mongoose.model<IUser>("User", UserSchema);