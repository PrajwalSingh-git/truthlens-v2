import { Info } from 'lucide-react'
import { Card } from '@/components/ui/card'

export default function ExplanationEngine({ explanations, guidance }) {
  return (
    <Card>
      <div className="mb-3 flex items-center gap-2">
        <Info className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-text">AI Explanation Engine</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted">
        This content shows signals associated with manipulative framing, including emotionally charged
        wording, urgency cues, or claims that require stronger evidence before being trusted.
      </p>

      <div className="mt-5">
        <div className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-primary">
          Verification guidance
        </div>
        <div className="space-y-2">
          {guidance.map((tip, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-card/40 px-4 py-3 text-sm text-text/90">
              {tip}
            </div>
          ))}
        </div>
      </div>

      {explanations?.length > 0 && (
        <div className="mt-5">
          <div className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-primary">
            Why this content scored this way
          </div>
          <ul className="space-y-2">
            {explanations.map((exp, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-muted">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {exp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  )
}
