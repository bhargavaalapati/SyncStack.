import { getOpenProjects } from "@/actions/project";
import Navbar from "@/components/ui/Navbar";
import ProjectCard from "@/components/ProjectCard";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const projects = await getOpenProjects();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-6xl">

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              The Project Bulletin
            </h1>
            <p className="text-muted-foreground text-lg">
              Discover high-potential architectures or recruit the exact technical peers required to execute yours.
            </p>
          </div>
          {/* Only show the Create button if logged in */}
          {session?.user && <CreateProjectDialog />}
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24 border-2 border-dashed rounded-xl bg-muted/20">
            <h3 className="text-xl font-semibold mb-2">No architectures deployed yet</h3>
            <p className="text-muted-foreground">Be the first visionary to broadcast a project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
}