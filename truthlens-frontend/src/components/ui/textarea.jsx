import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full resize-none rounded-xl border border-white/10 bg-card px-4 py-3 text-sm text-text outline-none transition-colors placeholder:text-muted/60 focus:border-primary/40 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
