import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="flex items-center justify-between p-4 border-b bg-card">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Image src="/logo.svg" alt="SyncStack Logo" width={32} height={32} priority />
                <span className="font-extrabold text-xl tracking-tight text-primary">SyncStack</span>
            </Link>

            <div>
                {session && session.user ? (
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-muted-foreground hidden md:block">
                            {session.user.name}
                        </span>
                        <form
                            action={async () => {
                                "use server";
                                await signOut();
                            }}
                        >
                            <Button variant="secondary" size="sm" type="submit">Log Out</Button>
                        </form>
                    </div>
                ) : (
                    <form
                        action={async () => {
                            "use server";
                            await signIn("github");
                        }}
                    >
                        <Button size="sm" type="submit">Continue with GitHub</Button>
                    </form>
                )}
            </div>
        </nav>
    );
}