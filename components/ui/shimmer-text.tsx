"use client";

import { cn } from "@/lib/utils";

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  shimmerWidth?: number;
}

export function ShimmerText({
  children,
  className,
  shimmerWidth = 100,
}: ShimmerTextProps) {
  return (
    <span
      className={cn(
        "relative mx-auto inline-block text-transparent bg-clip-text bg-[linear-gradient(110deg,#a755f7_-30%,#ffffff_45%,#a755f7_130%)] bg-[length:200%_100%] animate-shimmer",
        className
      )}
      style={{
        ["--shimmer-width" as any]: `${shimmerWidth}px`,
      }}
    >
      {children}
    </span>
  );
}
