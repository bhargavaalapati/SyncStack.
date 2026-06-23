import { auth, signIn, signOut } from "@/auth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, UserCircle, LogOut } from "lucide-react";

export default async function Navbar() {
    const session = await auth();

    return (
        <nav className="flex items-center justify-between p-4 border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <Image src="/logo.svg" alt="SyncStack Logo" width={32} height={32} priority />
                <span className="font-extrabold text-xl tracking-tight text-primary">SyncStack.</span>
            </Link>

            <div className="flex items-center gap-4">
                {/* Everyone can see the bulletin link */}
                <Link href="/bulletin">
                    <Button variant="ghost" size="sm" className="hidden md:inline-flex">Bulletin</Button>
                </Link>

                {session && session.user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger className="outline-none">
                            <div className="flex items-center gap-2 hover:ring-2 ring-primary/20 rounded-full transition-all p-1">
                                {session.user.image ? (
                                    <img src={session.user.image} alt="Profile" className="w-9 h-9 rounded-full border border-border" />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
                                        {session.user.name?.charAt(0) || "U"}
                                    </div>
                                )}
                            </div>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                    <p className="text-xs leading-none text-muted-foreground">{session.user.email}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link href="/dashboard">
                                <DropdownMenuItem className="cursor-pointer">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    <span>Mission Control</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/profile">
                                <DropdownMenuItem className="cursor-pointer">
                                    <UserCircle className="mr-2 h-4 w-4" />
                                    <span>Telemetry (Profile)</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <form action={async () => { "use server"; await signOut(); }}>
                                <button type="submit" className="w-full">
                                    <DropdownMenuItem className="cursor-pointer text-red-500 focus:text-red-500">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log Out</span>
                                    </DropdownMenuItem>
                                </button>
                            </form>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <form action={async () => { "use server"; await signIn("github"); }}>
                        <Button size="sm" type="submit">Continue with GitHub</Button>
                    </form>
                )}
            </div>
        </nav>
    );
}