import Navbar from "@/components/ui/Navbar";
import { getDashboardData, updateApplicationStatus } from "@/actions/application";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaGithub } from "react-icons/fa";

export default async function Dashboard() {
    const session = await auth();
    if (!session) redirect("/");

    const applications = await getDashboardData();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
                <h1 className="text-4xl font-extrabold tracking-tight mb-8">Mission Control</h1>

                {applications.length === 0 ? (
                    <div className="text-center py-24 border-2 border-dashed rounded-xl bg-muted/20">
                        <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                        <p className="text-muted-foreground">Keep broadcasting your architectures to attract talent.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {applications.map((app: any) => (
                            <div key={app._id} className="border rounded-xl p-6 bg-card shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">

                                {/* Applicant Info */}
                                <div className="flex items-start gap-4">
                                    {app.applicant_id?.image ? (
                                        <img src={app.applicant_id.image} alt="avatar" className="w-12 h-12 rounded-full border" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-bold text-lg">
                                            {app.applicant_id?.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-lg">{app.applicant_id?.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Applied to: <span className="font-semibold text-foreground">{app.project_id?.title}</span>
                                        </p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <a href={app.applicant_id?.github_url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 hover:text-primary transition-colors">
                                                <FaGithub className="w-3 h-3" /> GitHub
                                            </a>
                                            <Badge variant="outline" className={
                                                app.status === "Pending" ? "text-amber-500 border-amber-500/30" :
                                                    app.status === "Accepted" ? "text-green-500 border-green-500/30" : "text-red-500 border-red-500/30"
                                            }>
                                                {app.status}
                                            </Badge>
                                        </div>
                                        <div className="mt-3 flex flex-wrap gap-1">
                                            {app.applicant_id?.tech_skills?.map((skill: string, i: number) => (
                                                <Badge key={i} variant="secondary" className="text-[10px]">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Workflow Actions */}
                                {app.status === "Pending" && (
                                    <div className="flex gap-2">
                                        <form action={async () => {
                                            "use server";
                                            await updateApplicationStatus(app._id, "Rejected");
                                        }}>
                                            <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" type="submit">Reject</Button>
                                        </form>
                                        <form action={async () => {
                                            "use server";
                                            await updateApplicationStatus(app._id, "Accepted");
                                        }}>
                                            <Button className="bg-green-600 hover:bg-green-700 text-white" type="submit">Accept Match</Button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}