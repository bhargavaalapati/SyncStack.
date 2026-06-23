"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateProject } from "@/actions/project";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

export default function EditProjectDialog({ project }: { project: any }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function onSubmit(formData: FormData) {
        setLoading(true);
        try {
            await updateProject(project._id, formData);
            toast.success("Architecture updated successfully!");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to update architecture parameters.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="h-8 px-2 border-border/60">
                    <Pencil className="w-3.5 h-3.5 mr-1" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Modify Architecture</DialogTitle>
                    <DialogDescription>
                        Update project parameters or specify structural dependencies for the matching engine.
                    </DialogDescription>
                </DialogHeader>
                <form action={onSubmit} className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="title" className="font-semibold">Project Title</Label>
                        <Input id="title" name="title" defaultValue={project.title} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="description" className="font-semibold">Problem Statement & Scope</Label>
                        <Textarea id="description" name="description" defaultValue={project.description} rows={4} required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="required_skills" className="font-semibold">Required Tech Stack (Comma separated)</Label>
                        <Input id="required_skills" name="required_skills" defaultValue={project.required_skills.join(", ")} required />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full mt-2">
                        {loading ? "Saving Changes..." : "Commit Parameters"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}