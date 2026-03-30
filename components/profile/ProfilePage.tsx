// components/profile/ProfilePage.tsx
'use client'

import { useState } from 'react'
import { useProfile, useMyTransactions } from '@/hooks/useUsers'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/hooks/useAuth'
import PageHeader from '@/components/shared/PageHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Shield, LogOut, KeyRound, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { userService } from '@/services/userService'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export default function ProfilePage() {
  const { data: me, isLoading } = useProfile()
  const { data: txData }        = useMyTransactions()
  const logout                  = useLogout()
  const isStaff                 = useAuthStore((s) => s.is_staff)
  const isSuperuser             = useAuthStore((s) => s.is_superuser)
  const qc                      = useQueryClient()

  const [editName, setEditName] = useState(false)
  const [name, setName]         = useState('')
  const [confirm, setConfirm]   = useState<'logout' | 'clear-password' | null>(null)
  const [saving, setSaving]     = useState(false)

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await userService.updateMe({ name })
      qc.invalidateQueries({ queryKey: ['me'] })
      toast.success('Name updated.')
      setEditName(false)
    } catch { toast.error('Failed to update.') }
    setSaving(false)
  }

  const handleClearPassword = async () => {
    setSaving(true)
    try {
      await userService.clearMyPassword()
      toast.success('Password cleared. You\'ll need to set a new one next login.')
      logout.mutate()
    } catch { toast.error('Failed.') }
    setSaving(false)
    setConfirm(null)
  }

  if (isLoading) return <div className="p-4 space-y-4"><Skeleton className="h-32 rounded-xl" /></div>

  return (
    <div>
      <PageHeader title="Profile" />

      <div className="px-4 pt-4 space-y-4 pb-8">
        {/* Avatar + info */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {(me?.name || me?.mobile_number || 'U')[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{me?.name || 'No name set'}</p>
                {isStaff     && <Shield size={14} className="text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">{me?.mobile_number}</p>
            </div>
          </div>

          <div className="flex gap-6 text-sm pt-2 border-t border-border">
            <div><p className="text-xs text-muted-foreground">Tickets</p><p className="font-bold">🎫 {me?.tickets}</p></div>
            <div><p className="text-xs text-muted-foreground">Role</p><p className="font-semibold">{isSuperuser ? 'Super Admin' : isStaff ? 'Admin' : 'User'}</p></div>
          </div>
        </div>

        {/* Edit name */}
        {editName ? (
          <form onSubmit={handleSaveName} className="space-y-2">
            <Label>Name</Label>
            <div className="flex gap-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" className="flex-1" />
              <Button type="submit" disabled={!name || saving} size="sm">Save</Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setEditName(false)}>Cancel</Button>
            </div>
          </form>
        ) : (
          <Button variant="outline" className="w-full justify-start" onClick={() => { setName(me?.name || ''); setEditName(true) }}>
            ✏️ Change Name
          </Button>
        )}

        <Button variant="outline" className="w-full justify-start" onClick={() => setConfirm('clear-password')}>
          <KeyRound size={14} className="mr-2" /> Clear Password
        </Button>

        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => setConfirm('logout')}>
          <LogOut size={14} className="mr-2" /> Log Out
        </Button>

        {/* Transactions */}
        {txData?.results.length ? (
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-semibold">Transaction History</h3>
            {txData.results.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-border text-sm">
                <div className="flex items-center gap-2.5">
                  {tx.transaction_type === 'credit'
                    ? <ArrowDownLeft size={15} className="text-green-600" />
                    : <ArrowUpRight size={15} className="text-destructive" />}
                  <div>
                    <p className="font-medium capitalize">{tx.reason.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
                <span className={`font-semibold text-sm ${tx.transaction_type === 'credit' ? 'text-green-600' : 'text-destructive'}`}>
                  {tx.transaction_type === 'credit' ? '+' : '-'}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <ConfirmDialog open={confirm === 'logout'} onOpenChange={(v) => !v && setConfirm(null)} title="Log Out" description="Are you sure you want to log out?" onConfirm={() => logout.mutate()} loading={logout.isPending} />
      <ConfirmDialog open={confirm === 'clear-password'} onOpenChange={(v) => !v && setConfirm(null)} title="Clear Password" description="You'll be logged out and need to set a new password on next login." onConfirm={handleClearPassword} loading={saving} />
    </div>
  )
}
