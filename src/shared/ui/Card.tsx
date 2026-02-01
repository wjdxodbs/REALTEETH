import { ReactNode } from "react";
import { cn } from "../lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-gradient-to-br from-white/20 to-white/10",
        "backdrop-blur-md border border-white/30",
        "shadow-lg hover:shadow-xl transition-all duration-300",
        onClick && "cursor-pointer hover:scale-[1.02]",
        className,
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
