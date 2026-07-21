import { Search, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'

const LINKS = [
  { label: 'Google News', url: 'https://news.google.com/search?q=' },
  { label: 'Reuters', url: 'https://www.reuters.com/site-search/?query=' },
  { label: 'AP News', url: 'https://apnews.com/search?q=' },
  { label: 'FactCheck.org', url: 'https://www.factcheck.org/?s=' },
  { label: 'Snopes', url: 'https://www.snopes.com/?s=' },
]

export default function FactCheckLinks({ query = '' }) {
  const q = encodeURIComponent(query.slice(0, 80))

  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <Search className="h-4 w-4 text-primary" />
        <h3 className="font-semibold text-text">Fast Fact-Check Links</h3>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={`${l.url}${q}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-card/60 px-4 py-2.5 text-sm font-medium text-text transition-colors hover:border-primary/40 hover:text-primary"
          >
            {l.label}
            <ExternalLink className="h-3.5 w-3.5 opacity-60" />
          </a>
        ))}
      </div>
    </Card>
  )
}
