import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

function Progress({ className, value, indicatorClassName, indicatorStyle, ...props }) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-card", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full flex-1 rounded-full bg-primary transition-all duration-700 ease-out", indicatorClassName)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)`, ...indicatorStyle }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
