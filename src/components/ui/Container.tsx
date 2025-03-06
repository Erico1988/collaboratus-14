
import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const Container = ({
  children,
  as: Component = "div",
  className,
  maxWidth = "xl",
  ...props
}: ContainerProps) => {
  const maxWidthClass = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
  };

  return (
    <Component
      className={cn(
        "w-full px-4 mx-auto sm:px-6 lg:px-8",
        maxWidthClass[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Container;
