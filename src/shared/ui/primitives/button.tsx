import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/shared/lib"

const buttonVariants = cva(
  // Base styles — mapped from design system .btn
  [
    "inline-flex shrink-0 items-center justify-center gap-2",
    "font-semibold whitespace-nowrap select-none cursor-pointer",
    "border border-transparent bg-clip-padding",
    "transition-all duration-[150ms] [transition-timing-function:cubic-bezier(.16,1,.3,1)]",
    "outline-none",
    // Focus-visible: 2px accent outline (matches :focus-visible in design system)
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
    // Disabled
    "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
    // aria-invalid
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
    // SVG icons
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        // .btn-primary — accent bg, hover: glow + lift + brightness
        primary: [
          "bg-primary text-primary-foreground",
          "hover:-translate-y-px hover:brightness-105 hover:shadow-glow-sm",
          "active:translate-y-0 active:brightness-100 active:shadow-none",
        ],

        // .btn-secondary — surface bg + border
        secondary: [
          "bg-surface text-foreground border-edge",
          "hover:bg-surface-hover hover:border-edge-hover",
          "active:bg-surface-active",
        ],

        // .btn-ghost — transparent, subtle hover
        ghost: [
          "bg-transparent text-subtle",
          "hover:bg-surface hover:text-foreground",
          "active:bg-surface-active",
        ],

        // .btn-outline — transparent with accent border
        outline: [
          "bg-transparent text-primary border-[1.5px] border-primary",
          "hover:bg-primary-dim",
          "active:bg-primary-dim active:brightness-95",
        ],

        // .btn-danger — danger dim bg, border appears on hover
        danger: [
          "bg-danger-dim text-danger border-transparent",
          "hover:border-danger",
          "active:brightness-95",
        ],

        // chip — pill-shaped toggle button (.chip / .chip.active)
        chip: [
          "bg-transparent text-muted border-edge",
          "rounded-full font-normal",
          "hover:border-edge-hover hover:text-subtle",
          "active:bg-surface",
          // active/selected state via aria-pressed or data-active
          "data-[active=true]:border-primary data-[active=true]:text-primary data-[active=true]:bg-primary-dim",
          "aria-pressed:border-primary aria-pressed:text-primary aria-pressed:bg-primary-dim",
        ],
      },

      size: {
        // btn-sm: height 32px
        sm: "h-8 px-4 text-xs rounded-sm",
        // btn-md: height 38px (default)
        md: "h-[38px] px-5 text-sm rounded-md",
        // btn-lg: height 44px
        lg: "h-11 px-6 text-base rounded-lg",
        // icon sizes
        icon: "size-[36px] p-0 rounded-md [&_svg:not([class*='size-'])]:size-[18px]",
        "icon-sm": "size-8 p-0 rounded-sm [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-11 p-0 rounded-lg [&_svg:not([class*='size-'])]:size-5",
        // chip size override (smaller padding, full radius)
        chip: "h-auto px-3 py-1 text-xs gap-1",
      },
    },

    // chip variant forces chip size by default
    compoundVariants: [
      {
        variant: "chip",
        size: "md",
        className: "h-auto px-3 py-1 text-xs gap-1",
      },
    ],

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  // chip variant defaults to chip size unless overridden
  const resolvedSize = size ?? (variant === "chip" ? "chip" : "md")

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={resolvedSize}
      className={cn(buttonVariants({ variant, size: resolvedSize, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
