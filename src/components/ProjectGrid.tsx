"use client";

import { useState } from "react";
import ProjectCard from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

export default function ProjectGrid({ initialProjects }: { initialProjects: any[] }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");

    const filteredProjects = initialProjects.filter((p) => {
        const matchesSearch =
            p.title.toLowerCase().includes(search.toLowerCase()) ||
            p.required_skills.some((skill: string) => skill.toLowerCase().includes(search.toLowerCase()));

        const matchesFilter = filter === "All" || p.domain === filter;

        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by skill, title..."
                        className="pl-10 h-10"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="relative w-full sm:w-48">
                    <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <select
                        className="h-10 w-full pl-10 pr-4 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="All">All Domains</option>
                        <option value="Web Development">Web Development</option>
                        <option value="AI/Machine Learning">AI/Machine Learning</option>
                        <option value="Cloud/DevOps">Cloud/DevOps</option>
                    </select>
                </div>
            </div>

            {filteredProjects.length === 0 ? (
                <div className="text-center py-24 border-2 border-dashed rounded-xl bg-muted/20">
                    <h3 className="text-xl font-semibold mb-2">No architectures found</h3>
                    <p className="text-muted-foreground">Try adjusting your filters.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project: any) => (
                        <ProjectCard key={project._id} project={project} />
                    ))}
                </div>
            )}
        </>
    );
}