"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProjectCard({ project }: { project: any }) {
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
                        {project.creator_id?.name?.split("") || "Unknown"}
                    </span>
                </div>
                <Button size="sm" variant="default">Request to Join</Button>
            </div>
        </motion.div>
    );
}