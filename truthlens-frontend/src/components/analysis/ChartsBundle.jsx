import { CredibilityDonut, PropagandaRadar, SentimentArcChart } from './ChartsRow'

// Single default-exported wrapper so the (heavy, recharts-based) chart
// trio can be lazy-loaded as one chunk via React.lazy in ResultsPanel.
export default function ChartsBundle({ result }) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <CredibilityDonut credibility={result.credibility} />
      <PropagandaRadar characteristics={result.propaganda_characteristics} />
      <SentimentArcChart arc={result.sentiment_arc} />
    </div>
  )
}
