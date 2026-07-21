import { motion } from 'framer-motion'
import { User, Code2, Server, BrainCircuit } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SOCIAL_LINKS, GithubMark, LinkedinMark, InstagramMark } from '@/lib/social'

const RESPONSIBILITIES = [
  { icon: Code2, text: 'Designed the complete frontend using React, Vite and Tailwind CSS with a modern cybersecurity-inspired UI.' },
  { icon: Server, text: 'Built backend APIs using FastAPI and integrated AI-powered content analysis.' },
  { icon: BrainCircuit, text: 'Implemented credibility scoring, propaganda detection, and explainable AI signal breakdowns.' },
]

const TECH_STACK = ['React', 'Vite', 'Tailwind CSS', 'FastAPI', 'Python', 'JavaScript', 'Supabase', 'Git', 'GitHub', 'REST APIs']

export default function Creator() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <User className="h-6 w-6" />
        </div>
        <div>
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
            About the developer
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">Designed &amp; Developed by Prajwal Singh</h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            TruthLens AI is an AI-powered misinformation detection platform created to help users evaluate
            the credibility of online content through transparent and explainable AI analysis.
          </p>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8">
        <Card>
          <h2 className="text-xl font-bold text-text">Prajwal Singh</h2>
          <p className="mt-1 text-sm font-medium text-primary">Full Stack Developer • AI Enthusiast</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            I am a Computer Science undergraduate passionate about software engineering, artificial
            intelligence, and full-stack development. TruthLens AI was independently designed and developed
            as a project focused on combating misinformation through explainable AI. Rather than simply
            predicting whether content is trustworthy, the platform helps users understand why a piece of
            information may be misleading.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
            <div>
              <h3 className="mb-3 font-semibold text-text">Responsibilities</h3>
              <ul className="space-y-3">
                {RESPONSIBILITIES.map((r) => (
                  <li key={r.text} className="flex gap-2.5 text-sm text-muted">
                    <r.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {r.text}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-semibold text-text">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((t) => (
                  <Badge key={t} variant="primary">{t}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
        <Card className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-text">Let's connect</h3>
            <p className="mt-1 text-sm text-muted">Find the project source or reach out directly.</p>
          </div>
          <div className="flex gap-3">
            <a href={SOCIAL_LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              className="rounded-lg border border-white/10 p-2.5 text-muted transition-colors hover:border-primary/40 hover:text-primary">
              <GithubMark className="h-4 w-4" />
            </a>
            <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="rounded-lg border border-white/10 p-2.5 text-muted transition-colors hover:border-primary/40 hover:text-primary">
              <LinkedinMark className="h-4 w-4" />
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="rounded-lg border border-white/10 p-2.5 text-muted transition-colors hover:border-primary/40 hover:text-primary">
              <InstagramMark className="h-4 w-4" />
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
