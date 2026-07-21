import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { SOCIAL_LINKS, GithubMark, LinkedinMark, InstagramMark } from '@/lib/social'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-surface/40">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="font-bold">
                Truth<span className="text-primary">Lens</span>
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">
              Explainable AI for evaluating what's true online — one signal at a time.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-text">Product</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/analyze" className="hover:text-primary">Analyze</Link></li>
              <li><Link to="/extension" className="hover:text-primary">Browser Extension</Link></li>
              <li><Link to="/about" className="hover:text-primary">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-text">Company</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/creator" className="hover:text-primary">Creator</Link></li>
              <li><Link to="/login" className="hover:text-primary">Sign in</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-text">Connect</h4>
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="rounded-lg border border-white/10 p-2 text-muted transition-colors hover:border-primary/40 hover:text-primary"
              >
                <GithubMark className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="rounded-lg border border-white/10 p-2 text-muted transition-colors hover:border-primary/40 hover:text-primary"
              >
                <LinkedinMark className="h-4 w-4" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="rounded-lg border border-white/10 p-2 text-muted transition-colors hover:border-primary/40 hover:text-primary"
              >
                <InstagramMark className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-muted md:flex-row">
          <span>© {new Date().getFullYear()} TruthLens AI. Built by Prajwal Singh.</span>
          <span>Every score comes with a reason.</span>
        </div>
      </div>
    </footer>
  )
}
