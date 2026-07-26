import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  MapPin, GraduationCap, Code2, Sparkles, ArrowRight, ArrowDown,
  Rocket, Mail, GitFork, Atom, Zap, Server, Brain, Database, Cloud,
  Palette, Globe2, Lightbulb, Cog, ShieldCheck,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StatsStrip from '@/components/common/StatsStrip'
import { SOCIAL_LINKS, GithubMark, LinkedinMark, InstagramMark } from '@/lib/social'

const STATS = [
  { value: 12, suffix: '+', label: 'Detection signals' },
  { value: 6, label: 'Core technologies' },
  { value: 100, suffix: '%', label: 'Explainable analysis' },
  { value: '24/7', isNumeric: false, label: 'Available online' },
]

const FEATURES_BUILT = [
  'Explainable AI engine',
  'FastAPI REST backend',
  'Google OAuth authentication',
  'Supabase integration',
  'Interactive analysis dashboard',
  'Propaganda & bias detection',
]

const ARCHITECTURE = [
  { icon: Globe2, title: 'Browser', desc: 'Where you interact with TruthLens — any modern browser, no install needed.' },
  { icon: Atom, title: 'React + Vite', desc: 'Frontend interface, routing, charts, and authentication state.' },
  { icon: Server, title: 'FastAPI API', desc: 'Handles requests, coordinates analysis, and enforces auth on protected routes.' },
  { icon: Brain, title: 'AI Analysis Engine', desc: 'Scores credibility, bias, and propaganda signals — heuristic or LLM-backed.' },
  { icon: Database, title: 'Supabase Database', desc: 'Stores accounts, analysis history, and saved reports securely.' },
]

const TIMELINE = [
  { icon: Lightbulb, label: 'Idea' },
  { icon: Palette, label: 'UI Design' },
  { icon: Cog, label: 'Backend' },
  { icon: Brain, label: 'AI Integration' },
  { icon: Cloud, label: 'Deployment' },
  { icon: Rocket, label: 'TruthLens v2' },
]

const TECH_STACK = [
  { name: 'React', category: 'Frontend', icon: Atom },
  { name: 'Vite', category: 'Build Tool', icon: Zap },
  { name: 'FastAPI', category: 'Backend', icon: Server },
  { name: 'Python', category: 'AI', icon: Brain },
  { name: 'Supabase', category: 'Database', icon: Database },
  { name: 'Render', category: 'Hosting', icon: Cloud },
  { name: 'Tailwind CSS', category: 'Styling', icon: Palette },
  { name: 'GitHub Pages', category: 'Deployment', icon: GithubMark },
]

const CHALLENGES = [
  { problem: 'GitHub Pages has no server-side routing', solution: 'Client-side redirect trick (404.html + history restore) to support clean React Router URLs.' },
  { problem: 'Google OAuth redirect kept resetting', solution: 'Diagnosed a Supabase Site URL / Redirect URL allow-list mismatch and corrected the dashboard config.' },
  { problem: 'JWT verification blocked the whole server', solution: "Found that Supabase's JWKS fetch was a blocking call inside an async route — moved it to a thread pool." },
]

const ROADMAP = ['Browser extension (Chrome)', 'AI-assisted fact verification', 'Mobile app', 'Community-submitted reports', 'Chrome Web Store listing']

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

function Section({ children, className = '' }) {
  return (
    <motion.section
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

export default function Creator() {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-primary/8 blur-[120px]"
          animate={{ x: [0, 25, -15, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mx-auto max-w-4xl divide-y divide-white/5 px-6 py-16 [&>*]:py-16 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
        {/* Hero */}
        <Section className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"
          >
            <Sparkles className="h-6 w-6" />
          </motion.div>
          <h1 className="text-3xl font-bold sm:text-4xl">Meet the Creator</h1>
          <p className="mt-3 text-lg text-muted">
            Building AI tools that make online information more transparent.
          </p>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted">
            TruthLens was built to help people understand <em className="text-text not-italic font-medium">why</em> information
            may be misleading — not just whether it is.
          </p>
        </Section>

        {/* Profile card */}
        <Section>
          <Card className="mx-auto max-w-sm text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              PS
            </div>
            <h2 className="mt-4 text-lg font-semibold text-text">Prajwal Singh</h2>
            <div className="mt-3 space-y-1.5 text-sm text-muted">
              <p className="flex items-center justify-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" /> Computer Science Undergraduate</p>
              <p className="flex items-center justify-center gap-1.5"><Code2 className="h-3.5 w-3.5" /> Full Stack Developer</p>
              <p className="flex items-center justify-center gap-1.5"><Sparkles className="h-3.5 w-3.5" /> AI Enthusiast</p>
              <p className="flex items-center justify-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> India</p>
            </div>
          </Card>
        </Section>

        {/* Stats */}
        <Section>
          <StatsStrip stats={STATS} />
        </Section>

        {/* Features built */}
        <Section>
          <h3 className="mb-5 text-center text-xl font-bold text-text">What TruthLens does</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {FEATURES_BUILT.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-card/40 px-4 py-3 text-sm text-text"
              >
                <span className="text-success">✓</span> {f}
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Architecture diagram — full-width cards with descriptions */}
        <Section>
          <h3 className="mb-2 text-center text-xl font-bold text-text">How it's built</h3>
          <p className="mb-6 text-center text-sm text-muted">A request's journey from your browser to a finished analysis.</p>
          <div className="mx-auto flex max-w-lg flex-col items-stretch gap-1">
            {ARCHITECTURE.map((step, i) => (
              <div key={step.title}>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <Card hover glow={false} className="flex items-start gap-4 transition-shadow hover:shadow-glow">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <step.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text">{step.title}</h4>
                      <p className="mt-1 text-sm text-muted">{step.desc}</p>
                    </div>
                  </Card>
                </motion.div>
                {i < ARCHITECTURE.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
                    className="flex justify-center py-1"
                  >
                    <motion.div
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.15 }}
                    >
                      <ArrowDown className="h-4 w-4 text-primary/50" />
                    </motion.div>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Timeline — icons with connecting line */}
        <Section>
          <h3 className="mb-6 text-center text-xl font-bold text-text">Project timeline</h3>
          <div className="relative mx-auto max-w-xs">
            <div className="absolute left-5 top-5 bottom-5 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent" />
            <div className="space-y-6">
              {TIMELINE.map((step, i) => (
                <motion.div
                  key={step.label}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="relative flex items-center gap-4"
                >
                  <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-bg text-primary">
                    <step.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-medium text-text">{step.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Tech stack — cards with icon + category */}
        <Section>
          <h3 className="mb-6 text-center text-xl font-bold text-text">Tech stack</h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TECH_STACK.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={{ y: -3 }}
              >
                <Card hover className="flex flex-col items-center gap-2 py-5 text-center transition-shadow hover:shadow-glow">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <t.icon className="h-4 w-4" />
                  </div>
                  <div className="text-sm font-semibold text-text">{t.name}</div>
                  <div className="text-[11px] uppercase tracking-wide text-muted">{t.category}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Challenges solved */}
        <Section>
          <h3 className="mb-5 text-center text-xl font-bold text-text">Challenges solved</h3>
          <div className="space-y-3">
            {CHALLENGES.map((c, i) => (
              <motion.div
                key={c.problem}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <Card className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-danger">Problem</div>
                    <p className="mt-1 text-sm text-text">{c.problem}</p>
                  </div>
                  <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted sm:block" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-success">Solution</div>
                    <p className="mt-1 text-sm text-text">{c.solution}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* Roadmap */}
        <Section>
          <h3 className="mb-5 text-center text-xl font-bold text-text">Coming next</h3>
          <Card>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {ROADMAP.map((r) => (
                <div key={r} className="flex items-center gap-2.5 text-sm text-muted">
                  <Rocket className="h-3.5 w-3.5 shrink-0 text-primary" /> {r}
                </div>
              ))}
            </div>
          </Card>
        </Section>

        {/* CTA */}
        <Section className="text-center">
          <h3 className="mb-5 text-xl font-bold text-text">Interested in the project?</h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/analyze">
              <Button icon={Sparkles}>Try TruthLens</Button>
            </Link>
            <a href={`${SOCIAL_LINKS.github}/truthlens-v2/fork`} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" icon={GitFork}>Fork on GitHub</Button>
            </a>
          </div>

          <p className="mb-3 mt-8 text-xs font-semibold uppercase tracking-widest text-muted">Contact Me</p>
          <div className="flex justify-center gap-3">
            <a
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="rounded-lg border border-white/10 p-2.5 text-muted transition-colors hover:border-primary/40 hover:text-primary"
            >
              <GithubMark className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="rounded-lg border border-white/10 p-2.5 text-muted transition-colors hover:border-primary/40 hover:text-primary"
            >
              <LinkedinMark className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="rounded-lg border border-white/10 p-2.5 text-muted transition-colors hover:border-primary/40 hover:text-primary"
            >
              <InstagramMark className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.mail}
              aria-label="Email"
              className="rounded-lg border border-white/10 p-2.5 text-muted transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </Section>
      </div>
    </div>
  )
}
