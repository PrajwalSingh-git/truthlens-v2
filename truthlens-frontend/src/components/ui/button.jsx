import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-bg font-semibold hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(34,211,238,0.35)]",
        secondary:
          "bg-card text-text border border-white/10 hover:border-primary/40 hover:bg-card/80",
        ghost: "text-muted hover:text-text hover:bg-card/60",
        destructive: "bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20",
        outline: "border border-white/10 bg-transparent text-text hover:border-primary/40 hover:bg-card/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-10 px-4",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 shrink-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className, variant, size, asChild = false, loading = false,
  icon: Icon, iconPosition = "left", children, disabled, ...props
}) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon className="h-4 w-4" />}
          {children}
          {Icon && iconPosition === "right" && <Icon className="h-4 w-4" />}
        </>
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
