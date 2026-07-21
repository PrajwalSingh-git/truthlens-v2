import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
      <ShieldAlert className="mb-4 h-12 w-12 text-muted" />
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="mt-2 text-muted">This page doesn't exist, or you don't have access to it.</p>
      <Link to="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}
