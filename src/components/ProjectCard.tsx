"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SuggestTeammates from "./SuggestTeammates";
import EditProjectDialog from "./EditProjectDialog";
import { deleteProject } from "@/actions/project";
import { applyToProject } from "@/actions/application";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function ProjectCard({ project, initialApplied = false }: { project: any, initialApplied?: boolean }) {
    const { data: session } = useSession();
    const [deleting, setDeleting] = useState(false);

    const isCreator = session?.user?.id === project.creator_id?._id;

    async function handleDelete() {
        if (!confirm("Are you absolutely sure you want to decommission this project architecture? This action cannot be undone.")) return;

        setDeleting(deleting => !deleting);
        try {
            await deleteProject(project._id);
            toast.success("Architecture purged from campus bulletin.");
        } catch (error) {
            toast.error("Failed to delete project execution parameters.");
            console.error(error);
            setDeleting(deleting => !deleting);
        }
    }

    return (
        <motion.div
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="border rounded-xl p-6 bg-card shadow-sm flex flex-col justify-between h-full relative overflow-hidden"
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

            <div className="flex items-center justify-between mt-auto pt-4 border-t gap-2">
                <div className="flex items-center gap-2 max-w-[40%]">
                    {project.creator_id?.image ? (
                        <img
                            src={project.creator_id.image}
                            alt="Creator Avatar"
                            className="w-7 h-7 rounded-full border border-border shrink-0"
                        />
                    ) : (
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0">
                            {project.creator_id?.name?.charAt(0) || "U"}
                        </div>
                    )}
                    <span className="text-xs font-medium text-muted-foreground truncate">
                        {project.creator_id?.name?.split(" ")[0] || "Unknown"}
                    </span>
                </div>

                {/* Dynamic Architectural Interaction Node */}
                {isCreator ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                        <SuggestTeammates projectId={project._id} />
                        <EditProjectDialog project={project} />
                        <Button
                            size="sm"
                            variant="outline"
                            className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-border/60 dark:hover:bg-red-950/20"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                ) : (
                    <div className="shrink-0">
                        <JoinButton projectId={project._id} initialApplied={initialApplied} />
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function JoinButton({ projectId, initialApplied }: { projectId: string, initialApplied: boolean }) {
    const [loading, setLoading] = useState(false);
    const [applied, setApplied] = useState(initialApplied);

    async function handleApply() {
        setLoading(true);
        try {
            await applyToProject(projectId);
            setApplied(true);
            toast.success("Application transmitted to project architecture board!");
        } catch (error: any) {
            if (error.message.includes("already applied")) {
                setApplied(true);
            }
            toast.error("Failed to complete request propagation.");
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