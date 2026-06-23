import Link from "next/link";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="w-full border-t bg-card/30 backdrop-blur-md py-8 mt-auto">
            <div className="container mx-auto max-w-6xl px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="font-bold tracking-tight text-sm">SyncStack.</span>
                    <p className="text-xs text-muted-foreground">
                        © {new Date().getFullYear()} Campus Incubation Ecosystem. All rights reserved.
                    </p>
                </div>

                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <Link href="/bulletin" className="hover:text-foreground transition-colors">Bulletin</Link>
                    <Link href="https://github.com" target="_blank" className="flex items-center gap-1 hover:text-foreground transition-colors">
                        <FaGithub className="w-3 h-3" /> System Docs
                    </Link>
                    <span className="cursor-default select-none">v1.0.0-MVP</span>
                </div>
            </div>
        </footer>
    );
}