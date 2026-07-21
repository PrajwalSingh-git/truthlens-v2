import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cn } from "@/lib/utils"

function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn("mb-1.5 block text-xs font-medium text-muted", className)}
      {...props}
    />
  )
}

export { Label }
