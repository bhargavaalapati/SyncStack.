"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { updateApplicationStatus } from "@/actions/application";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function DashboardActionButtons({ appId }: { appId: string }) {
    const [isPending, startTransition] = useTransition();

    const handleStatusMutation = (status: "Accepted" | "Rejected") => {
        startTransition(async () => {
            try {
                await updateApplicationStatus(appId, status);
                if (status === "Accepted") {
                    toast.success("Peer match confirmed! Secure telemetry access revealed.");
                } else {
                    toast.error("Application marked as rejected.");
                }
            } catch (err) {
                toast.error("Failed to mutate workflow status execution.");
                console.error(err);
            }
        });
    };

    return (
        <div className="flex gap-2 items-center">
            {isPending ? (
                <Button variant="ghost" disabled size="sm" className="text-muted-foreground gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </Button>
            ) : (
                <>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
                        onClick={() => handleStatusMutation("Rejected")}
                    >
                        Reject
                    </Button>
                    <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                        onClick={() => handleStatusMutation("Accepted")}
                    >
                        Accept Match
                    </Button>
                </>
            )}
        </div>
    );
}