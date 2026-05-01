import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "outline" | "ghost" | "error";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
}

export const Button = ({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: ButtonProps) => {
  const Comp = asChild ? Slot : "button";
  
  const variants = {
    primary: "bg-primary text-on-primary shadow-[0_4px_12px_-2px_rgba(131,84,0,0.3)] hover:shadow-[0_8px_20px_-4px_rgba(131,84,0,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:shadow-inner",
    secondary: "bg-secondary text-on-secondary shadow-[0_4px_12px_-2px_rgba(56,107,1,0.3)] hover:shadow-[0_8px_20px_-4px_rgba(56,107,1,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:shadow-inner",
    tertiary: "bg-tertiary text-on-tertiary shadow-[0_4px_12px_-2px_rgba(0,99,154,0.3)] hover:shadow-[0_8px_20px_-4px_rgba(0,99,154,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 active:shadow-inner",
    outline: "border-2 border-outline-variant bg-transparent text-on-surface hover:bg-surface-container hover:border-primary/30 active:scale-95",
    ghost: "bg-transparent text-on-surface hover:bg-surface-container active:scale-95",
    error: "bg-red-600 text-white shadow-md hover:bg-red-700 active:scale-95",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm font-bold",
    md: "px-6 py-3 text-base font-bold",
    lg: "px-10 py-5 text-lg font-extrabold tracking-tight",
    icon: "p-2 aspect-square flex items-center justify-center",
  };

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-2xl font-lexend transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
};
