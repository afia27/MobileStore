"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "ghost";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-md border px-3 py-2 text-sm shadow-sm transition-colors cursor-pointer";
    const variants: Record<Variant, string> = {
      default: "bg-black text-white border-black hover:bg-gray-900",
      secondary: "bg-stone-800 text-stone-100 border-stone-700 hover:bg-stone-700",
      ghost: "bg-transparent border-transparent text-stone-100 hover:bg-stone-800/50",
    };
    return (
      <button ref={ref} className={cn(base, variants[variant], className)} {...props} />
    );
  }
);
Button.displayName = "Button";


