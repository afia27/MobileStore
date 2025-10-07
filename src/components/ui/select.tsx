"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full border border-stone-700 rounded-md px-3 py-2 bg-stone-900 text-stone-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-stone-400 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";


