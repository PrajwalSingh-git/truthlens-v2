const toneClass = {
  danger: 'bg-danger/20 text-danger border-b border-danger/50',
  warning: 'bg-warning/20 text-warning border-b border-warning/50',
  primary: 'bg-primary/20 text-primary border-b border-primary/50',
}

export default function HighlightedText({ text, flags = [] }) {
  if (!flags.length) {
    return <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{text}</p>
  }

  // Build a sorted, non-overlapping list of highlight ranges
  const sorted = [...flags].sort((a, b) => a.start - b.start)
  const nodes = []
  let cursor = 0

  sorted.forEach((flag, i) => {
    if (flag.start > cursor) {
      nodes.push(<span key={`plain-${i}`}>{text.slice(cursor, flag.start)}</span>)
    }
    nodes.push(
      <mark
        key={`flag-${i}`}
        title={flag.reason}
        className={`rounded px-0.5 ${toneClass[flag.tone] || toneClass.warning}`}
      >
        {text.slice(flag.start, flag.end)}
      </mark>
    )
    cursor = Math.max(cursor, flag.end)
  })

  if (cursor < text.length) {
    nodes.push(<span key="plain-end">{text.slice(cursor)}</span>)
  }

  return <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted">{nodes}</p>
}
