import { ShieldQuestion } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function ResponsibleAINote() {
  return (
    <Card className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <ShieldQuestion className="h-5 w-5" />
      </div>
      <div>
        <h3 className="font-semibold text-text">Responsible AI Note</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          TruthLens AI estimates risk signals; it does not declare absolute truth. Use the scores as a
          starting point for verification with primary sources, reputable reporting, and domain experts.
        </p>
      </div>
    </Card>
  )
}
