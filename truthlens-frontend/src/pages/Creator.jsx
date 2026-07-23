import { motion } from 'framer-motion'
import {
  MapPin, GraduationCap, Code2, Sparkles, ArrowRight,
  FileText, Rocket, Mail,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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

const ARCHITECTURE = ['Browser', 'React + Vite', 'FastAPI', 'AI Analysis', 'Supabase']

const TIMELINE = ['Idea', 'UI Design', 'FastAPI backend', 'Supabase integration', 'Deployment', 'TruthLens v2']

const TECH_STACK = ['React', 'Vite', 'FastAPI', 'Python', 'Supabase', 'GitHub Pages', 'Render', 'Tailwind CSS']

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

      <div className="mx-auto max-w-4xl space-y-16 px-6 py-16">
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

        {/* Architecture diagram */}
        <Section>
          <h3 className="mb-5 text-center text-xl font-bold text-text">How it's built</h3>
          <Card>
            <div className="flex flex-col items-center gap-2">
              {ARCHITECTURE.map((step, i) => (
                <motion.div key={step} className="flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    className="rounded-xl border border-primary/30 bg-primary/5 px-6 py-2.5 text-sm font-medium text-primary"
                  >
                    {step}
                  </motion.div>
                  {i < ARCHITECTURE.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      whileInView={{ opacity: 1, height: 20 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.2, delay: i * 0.1 + 0.15 }}
                      className="w-px bg-primary/30"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </Section>

        {/* Timeline */}
        <Section>
          <h3 className="mb-5 text-center text-xl font-bold text-text">Project timeline</h3>
          <div className="relative mx-auto max-w-md">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-white/10" />
            <div className="space-y-5">
              {TIMELINE.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className="relative flex items-center gap-4 pl-1"
                >
                  <span className="z-10 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-primary bg-bg" />
                  <span className="text-sm font-medium text-text">{step}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* Tech stack */}
        <Section>
          <h3 className="mb-5 text-center text-xl font-bold text-text">Tech stack</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {TECH_STACK.map((t, i) => (
              <motion.div
                key={t}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                whileHover={{ y: -3 }}
                className="rounded-xl border border-white/10 bg-card/50 px-5 py-3 text-sm font-medium text-text transition-all hover:border-primary/40 hover:shadow-glow"
              >
                {t}
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
            <a href="/analyze">
              <Button icon={Sparkles}>Try TruthLens</Button>
            </a>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <Button variant="secondary" icon={FileText}>View Resume</Button>
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
              target="_blank"
              rel="noopener noreferrer"
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
