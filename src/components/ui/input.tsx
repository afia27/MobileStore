"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full border border-stone-700 rounded-md px-3 py-2 bg-stone-900 text-stone-100 placeholder:text-stone-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-400",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";


