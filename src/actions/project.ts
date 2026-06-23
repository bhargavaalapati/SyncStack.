"use server";

import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { Application } from "@/models/Application";
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

    revalidatePath("/bulletin");
    return JSON.parse(JSON.stringify(newProject));
}

// 2. Fetch all open projects for the bulletin board
export async function getOpenProjects() {
    await connectDB();

    const projects = await Project.find({ status: "Open" })
        .populate("creator_id", "name image github_url")
        .sort({ createdAt: -1 })
        .lean();

    return JSON.parse(JSON.stringify(projects));
}

// 3. Update an existing project configuration (Creator Only)
export async function updateProject(projectId: string, formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await connectDB();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const required_skills_raw = formData.get("required_skills") as string;

    const required_skills = required_skills_raw
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

    // atomic write constraint confirming creator identity
    const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, creator_id: session.user.id },
        { title, description, required_skills },
        { new: true }
    );

    if (!updatedProject) throw new Error("Project not found or unauthorized.");

    revalidatePath("/bulletin");
    return JSON.parse(JSON.stringify(updatedProject));
}

// 4. Delete a project and cascade purge requests (Creator Only)
export async function deleteProject(projectId: string) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await connectDB();

    // Enforce creator validation at the database constraint layer
    const deletedProject = await Project.findOneAndDelete({
        _id: projectId,
        creator_id: session.user.id,
    });

    if (!deletedProject) throw new Error("Project not found or unauthorized.");

    // Cascade delete all incoming developer applications to maintain data relational sanity
    await Application.deleteMany({ project_id: projectId });

    revalidatePath("/bulletin");
    return { success: true };
}