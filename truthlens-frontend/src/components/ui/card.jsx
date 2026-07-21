import * as React from "react"
import { cn } from "@/lib/utils"

function Card({ className, hover = false, glow = false, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "glass-panel rounded-2xl p-6",
        hover && "transition-all duration-300 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-glow",
        glow && "shadow-glow",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div data-slot="card-header" className={cn("mb-4 flex flex-col gap-1.5", className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return <h3 data-slot="card-title" className={cn("font-semibold text-text leading-none", className)} {...props} />
}

function CardDescription({ className, ...props }) {
  return <p data-slot="card-description" className={cn("text-sm text-muted", className)} {...props} />
}

function CardContent({ className, ...props }) {
  return <div data-slot="card-content" className={cn(className)} {...props} />
}

function CardFooter({ className, ...props }) {
  return <div data-slot="card-footer" className={cn("mt-4 flex items-center", className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
