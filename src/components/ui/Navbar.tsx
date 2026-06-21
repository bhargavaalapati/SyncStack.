import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="flex items-center justify-between p-4 border-b">
            <div className="font-bold text-xl tracking-tight">SyncStack.</div>

            <div>
                {session && session.user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                            {session.user.name}
                        </span>
                        <form
                            action={async () => {
                                "use server";
                                await signOut();
                            }}
                        >
                            <Button variant="outline" type="submit">Log Out</Button>
                        </form>
                    </div>
                ) : (
                    <form
                        action={async () => {
                            "use server";
                            await signIn("github");
                        }}
                    >
                        <Button type="submit">Continue with GitHub</Button>
                    </form>
                )}
            </div>
        </nav>
    );
}