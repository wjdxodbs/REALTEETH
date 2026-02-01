import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "../lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-3 rounded-2xl bg-white/30 backdrop-blur-sm",
            "text-white placeholder-white/70",
            "border border-white/20 focus:border-white/40",
            "focus:outline-none focus:ring-2 focus:ring-white/20",
            "transition-all",
            error && "border-red-400",
            className,
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-200">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
