import { cn } from "@/lib/utils";
import { Zap } from "lucide-react";

export function Logo(props: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2", props.className)}>
      <Zap className="h-4 w-4 fill-current" />
      <span className="font-semibold text-sm">HookSentry</span>
    </div>
  );
}
