import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, ScanSearch, Eye, Trash2, LogOut, ShieldAlert } from 'lucide-react'
import toast from 'react-hot-toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import CountUp from '@/components/ui/count-up'
import { adminApi, clearAdminToken } from '@/services/adminApi'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    load()
  }, [])

  async function load() {
    setLoading(true)
    try {
      const [s, u] = await Promise.all([adminApi.getStats(), adminApi.getUsers()])
      setStats(s)
      setUsers(u)
    } catch (err) {
      toast.error(err.message || 'Could not load admin data.')
    } finally {
      setLoading(false)
    }
  }

  function handleLogout() {
    clearAdminToken()
    navigate('/creator-admin/login')
  }

  async function handleImpersonate(user) {
    try {
      await adminApi.impersonate(user.id)
      toast.success(`Now viewing as ${user.email}`)
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Could not impersonate this user.')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await adminApi.deleteUser(deleteTarget.id)
      toast.success(`Deleted ${deleteTarget.email}`)
      setUsers((u) => u.filter((x) => x.id !== deleteTarget.id))
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.message || 'Could not delete this user.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-10 text-text">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10 text-danger">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Dashboard</h1>
              <p className="text-sm text-muted">Internal — not linked from the public site.</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" icon={LogOut} onClick={handleLogout}>Log out</Button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats ? <CountUp value={stats.total_users} duration={1} /> : '—'}
                </div>
                <div className="text-xs text-muted">Total users</div>
              </div>
            </Card>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <Card className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                <ScanSearch className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {stats ? <CountUp value={stats.total_searches} duration={1} /> : '—'}
                </div>
                <div className="text-xs text-muted">Total searches</div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Users table */}
        <Card>
          <h2 className="mb-4 font-semibold text-text">Users</h2>
          {loading ? (
            <div className="py-10 text-center text-sm text-muted">Loading…</div>
          ) : users.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted">No users yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-muted">
                    <th className="pb-2 pr-4">User</th>
                    <th className="pb-2 pr-4">Joined</th>
                    <th className="pb-2 pr-4">Searches</th>
                    <th className="pb-2 pr-4">Last search</th>
                    <th className="pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td className="py-3 pr-4">
                        <div className="font-medium text-text">{u.full_name || '—'}</div>
                        <div className="text-xs text-muted">{u.email}</div>
                      </td>
                      <td className="py-3 pr-4 text-muted">
                        {new Date(u.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-3 pr-4">
                        <Badge variant="primary">{u.search_count}</Badge>
                      </td>
                      <td className="py-3 pr-4 text-muted">
                        {u.last_search_at
                          ? new Date(u.last_search_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
                          : '—'}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => handleImpersonate(u)}
                            title="View as this user"
                            className="rounded-lg p-2 text-muted transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(u)}
                            title="Delete this user"
                            className="rounded-lg p-2 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this user?</DialogTitle>
            <DialogDescription>
              This permanently deletes <span className="font-semibold text-text">{deleteTarget?.email}</span> and
              archives their summary info. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
            <Button variant="destructive" icon={Trash2} loading={deleting} onClick={handleDelete}>
              Delete User
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
