import Navbar from "@/components/ui/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="p-8">
        <h1 className="text-4xl font-extrabold tracking-tight">
          Welcome to the MVP.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          The GitHub OAuth pipeline is active.
        </p>
      </div>
    </main>
  );
}