"use server";

import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. Create a new project
export async function createProject(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized: Must be logged in to create a project.");

    await connectDB();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const required_skills_raw = formData.get("required_skills") as string;

    // Convert a comma-separated string (e.g., "React, Node, Python") into a clean array
    const required_skills = required_skills_raw
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

    const newProject = await Project.create({
        creator_id: session.user.id,
        title,
        description,
        required_skills,
        status: "Open",
    });

    // Automatically refresh the homepage/bulletin so the new project appears instantly
    revalidatePath("/");

    // We stringify and parse to strip Mongoose methods and pass pure JSON to the client
    return JSON.parse(JSON.stringify(newProject));
}

// 2. Fetch all open projects for the bulletin board
export async function getOpenProjects() {
    await connectDB();

    const projects = await Project.find({ status: "Open" })
        .populate("creator_id", "name image github_url") // Pull the creator's info to display on the card
        .sort({ createdAt: -1 }) // Newest first
        .lean(); // .lean() is crucial here for performance; it returns plain JS objects instead of heavy Mongoose documents

    return JSON.parse(JSON.stringify(projects));
}