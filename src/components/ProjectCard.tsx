"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SuggestTeammates from "./SuggestTeammates";
import { useSession } from "next-auth/react"; // We need the client-side hook
import { applyToProject } from "@/actions/application";
import { useState } from "react";

export default function ProjectCard({ project, initialApplied = false }: { project: any, initialApplied: boolean }) {
    const { data: session } = useSession();

    // Check if the currently logged-in user is the creator of this project
    const isCreator = session?.user?.id === project.creator_id?._id;

    return (
        <motion.div
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="border rounded-xl p-6 bg-card shadow-sm flex flex-col justify-between h-full"
        >
            <div>
                <div className="flex justify-between items-start mb-4 gap-4">
                    <h3 className="text-xl font-bold tracking-tight leading-tight">{project.title}</h3>
                    <Badge variant="secondary" className="whitespace-nowrap">{project.status}</Badge>
                </div>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
                    {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.required_skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-primary/5 border-primary/20">
                            {skill}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t">
                <div className="flex items-center gap-3">
                    {project.creator_id?.image ? (
                        <img
                            src={project.creator_id.image}
                            alt="Creator Avatar"
                            className="w-8 h-8 rounded-full border border-border"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                            {project.creator_id?.name?.charAt(0) || "U"}
                        </div>
                    )}
                    <span className="text-xs font-medium text-muted-foreground">
                        {project.creator_id?.name?.split(" ")[0] || "Unknown"}
                    </span>
                </div>

                {/* Conditional Logic: AI Button for Creator, Join Button for others */}
                {isCreator ? (
                    <SuggestTeammates projectId={project._id} />
                ) : (
                    <JoinButton projectId={project._id} initialApplied={initialApplied} />
                )}
            </div>
        </motion.div>
    );
}

// 2. Update the JoinButton signature and state at the bottom of the file
function JoinButton({ projectId, initialApplied }: { projectId: string, initialApplied: boolean }) {
    const [loading, setLoading] = useState(false);

    // Initialize state using the truth from the server!
    const [applied, setApplied] = useState(initialApplied);

    async function handleApply() {
        setLoading(true);
        try {
            await applyToProject(projectId);
            setApplied(true);
        } catch (error: any) {
            if (error.message.includes("already applied")) {
                setApplied(true);
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (applied) {
        return <Button size="sm" variant="secondary" disabled>Application Sent</Button>;
    }

    return (
        <Button size="sm" variant="default" onClick={handleApply} disabled={loading}>
            {loading ? "Sending..." : "Request to Join"}
        </Button>
    );
}