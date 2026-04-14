import type { ElementType, ReactNode } from "react";
import { cn } from "@/shared/lib";

type TypographyTag =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "p"
  | "span"
  | "strong"
  | "em"
  | "label"
  | "blockquote"
  | "li"
  | "caption";

type TypographySize =
  | "xs"
  | "sm"
  | "base"
  | "lg"
  | "xl"
  | "2xl"
  | "3xl"
  | "4xl"
  | "5xl"
  | "6xl";

const sizeClasses: Record<TypographySize, string> = {
  xs: "text-xs",     // 12px
  sm: "text-sm",     // 14px
  base: "text-base", // 16px
  lg: "text-lg",     // 18px
  xl: "text-xl",     // 20px
  "2xl": "text-2xl", // 24px
  "3xl": "text-3xl", // 30px
  "4xl": "text-4xl", // 36px
  "5xl": "text-5xl", // 48px
  "6xl": "text-6xl", // 60px
};

interface TypographyProps {
  tag?: TypographyTag;
  size?: TypographySize;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
}

export function Typography({
  tag: Tag = "p",
  size,
  className,
  children,
  ...props
}: TypographyProps) {
  const Element = Tag as ElementType;

  return (
    <Element
      className={cn(size && sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Element>
  );
}
