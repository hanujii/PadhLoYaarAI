import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:shadow-primary/40 hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "hover:bg-secondary hover:text-foreground",
        link:
          "text-primary underline-offset-4 hover:underline",
        glow:
          "bg-primary text-primary-foreground shadow-[0_0_20px_hsla(var(--primary),0.4)] hover:shadow-[0_0_30px_hsla(var(--primary),0.6)] hover:-translate-y-0.5 transition-all duration-300",
        gradient:
          "bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:brightness-110 transition-all duration-300",
        glass:
          "bg-secondary/50 backdrop-blur-md border border-border text-foreground hover:bg-secondary hover:border-primary/30 transition-all duration-300",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-xl px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          loading && "relative text-transparent hover:text-transparent"
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </div>
        )}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

// Animated button with shine effect
const ButtonShine = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "relative overflow-hidden group",
          className
        )}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </Button>
    )
  }
)
ButtonShine.displayName = "ButtonShine"

export { Button, ButtonShine, buttonVariants }
