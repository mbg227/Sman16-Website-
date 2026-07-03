import { cn } from "@/lib/utils";

export default function Skeleton({ className = "" }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-coklat-muda/20 dark:bg-coklat-muda/10",
        className
      )}
    />
  );
}
