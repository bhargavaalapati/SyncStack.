import Navbar from "@/components/ui/Navbar";
import { getUserProfile, updateProfile } from "@/actions/profile";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default async function ProfilePage() {
    const session = await auth();
    if (!session) redirect("/");

    const user = await getUserProfile();
    if (!user) redirect("/");

    // Pre-fill the form with existing skills joined by a comma
    const currentSkillsString = user.tech_skills?.join(", ") || "";

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-2xl">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Developer Telemetry</h1>
                <p className="text-muted-foreground mb-8">
                    Update your technical stack so the Gemini AI can accurately match you to high-potential projects.
                </p>

                <div className="border rounded-xl p-8 bg-card shadow-sm">
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b">
                        {user.image ? (
                            <img src={user.image} alt="avatar" className="w-16 h-16 rounded-full border-2" />
                        ) : (
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center font-bold text-xl">
                                {user.name?.charAt(0) || "U"}
                            </div>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    <form action={updateProfile} className="grid gap-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="branch" className="font-semibold">Academic Branch</Label>
                                <Input
                                    id="branch"
                                    name="branch"
                                    defaultValue={user.branch || ""}
                                    placeholder="e.g., Computer Science"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="graduation_year" className="font-semibold">Graduation Year</Label>
                                <Input
                                    id="graduation_year"
                                    name="graduation_year"
                                    type="number"
                                    defaultValue={user.graduation_year || ""}
                                    placeholder="e.g., 2026"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="bio" className="font-semibold">Developer Bio</Label>
                            <Input
                                id="bio"
                                name="bio"
                                defaultValue={user.bio || ""}
                                placeholder="e.g., Full Stack Engineer specializing in optimization algorithms and data systems."
                                maxLength={160}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="tech_skills" className="font-semibold">Technical Skills (Comma separated)</Label>
                            <Input
                                id="tech_skills"
                                name="tech_skills"
                                defaultValue={currentSkillsString}
                                placeholder="e.g., React, Node.js, Python, MongoDB"
                            />
                            <p className="text-xs text-muted-foreground">
                                These frameworks are ingested directly by the Gemini model to calculate your compatibility scores.
                            </p>
                        </div>

                        {user.tech_skills && user.tech_skills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {user.tech_skills.map((skill: string, idx: number) => (
                                    <Badge key={idx} variant="secondary">{skill}</Badge>
                                ))}
                            </div>
                        )}

                        <Button type="submit" className="w-full mt-4">Save Telemetry</Button>
                    </form>
                </div>
            </main>
        </div>
    );
}