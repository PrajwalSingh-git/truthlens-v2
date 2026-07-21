import { motion } from 'framer-motion'
import {
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar,
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/ui/card'

const RADAR_LABELS = {
  fear: 'Fear',
  urgency: 'Urgency',
  us_vs_them: 'Us vs Them',
  evidence_gap: 'Evidence Gap',
  authority_attack: 'Authority Attack',
  repetition: 'Repetition',
}

export function CredibilityDonut({ credibility }) {
  const risk = 100 - credibility
  const data = [
    { name: 'Credible', value: credibility },
    { name: 'Risk', value: risk },
  ]
  const colors = ['#22D3EE', '#EF4444']

  return (
    <Card>
      <h3 className="mb-4 font-semibold text-text">Credibility Distribution</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={colors[i]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex justify-center gap-5 text-xs text-muted">
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Credible {Math.round(credibility)}%</span>
        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-danger" /> Risk {Math.round(risk)}%</span>
      </div>
    </Card>
  )
}

export function PropagandaRadar({ characteristics }) {
  const data = Object.entries(characteristics).map(([key, value]) => ({
    subject: RADAR_LABELS[key] || key,
    value,
  }))

  return (
    <Card>
      <h3 className="mb-4 font-semibold text-text">Propaganda Characteristics</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke="#1e2c3a" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 11 }} />
            <Radar dataKey="value" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.35} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

export function SentimentArcChart({ arc }) {
  const data = [
    { stage: 'Opening', value: arc.opening },
    { stage: 'Middle', value: arc.middle },
    { stage: 'Close', value: arc.close },
  ]

  return (
    <Card>
      <h3 className="mb-4 font-semibold text-text">Sentiment / Emotion</h3>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 6, right: 6, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="sentimentFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#22D3EE" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <XAxis dataKey="stage" tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={{ stroke: '#1e2c3a' }} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#94A3B8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Area type="monotone" dataKey="value" stroke="#22D3EE" strokeWidth={2} fill="url(#sentimentFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
