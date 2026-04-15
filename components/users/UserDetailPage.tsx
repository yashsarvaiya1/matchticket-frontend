// components/users/UserDetailPage.tsx
'use client'

import { useState } from 'react'
import { useUser, useAddTickets, useRemoveTickets, useUserTransactions } from '@/hooks/useUsers'
import { useAuthStore } from '@/stores/authStore'
import PageHeader from '@/components/shared/PageHeader'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Shield, Ticket, Trash2, RotateCcw, KeyRound } from 'lucide-react'
import { userService } from '@/services/userService'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'

export default function UserDetailPage({ userId }: { userId: number }) {
  const { data: user, isLoading } = useUser(userId)
  const { data: txData }          = useUserTransactions(userId)
  const isSuperuser               = useAuthStore((s) => s.is_superuser)
  const qc                        = useQueryClient()

  const addMutation    = useAddTickets(userId)
  const removeMutation = useRemoveTickets(userId)

  const [ticketSheet, setTicketSheet] = useState<'add' | 'remove' | null>(null)
  const [amount, setAmount]           = useState('')
  const [note, setNote]               = useState('')
  const [confirm, setConfirm]         = useState<'deactivate' | 'clear-password' | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (ticketSheet === 'add') {
      addMutation.mutate({ amount, note }, { onSuccess: () => { setTicketSheet(null); setAmount(''); setNote('') } })
    } else {
      removeMutation.mutate({ amount, note }, { onSuccess: () => { setTicketSheet(null); setAmount(''); setNote('') } })
    }
  }

  const handleDeactivate = async () => {
    setActionLoading(true)
    try {
      await userService.deactivate(userId)
      qc.invalidateQueries({ queryKey: ['user', userId] })
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success('User deactivated.')
    } catch { toast.error('Failed.') }
    setActionLoading(false)
    setConfirm(null)
  }

  const handleActivate = async () => {
    setActionLoading(true)
    try {
      await userService.activate(userId)
      qc.invalidateQueries({ queryKey: ['user', userId] })
      toast.success('User activated.')
    } catch { toast.error('Failed.') }
    setActionLoading(false)
  }

  const handleClearPassword = async () => {
    setActionLoading(true)
    try {
      await userService.clearPassword(userId)
      toast.success('Password cleared.')
    } catch { toast.error('Failed.') }
    setActionLoading(false)
    setConfirm(null)
  }

  if (isLoading) return <div className="p-4 space-y-4"><Skeleton className="h-32 rounded-xl" /><Skeleton className="h-48 rounded-xl" /></div>
  if (!user) return <div className="p-8 text-center text-muted-foreground text-sm">User not found.</div>

  const canDeactivate  = !user.is_superuser && (isSuperuser || !user.is_staff)
  const canClearPass   = isSuperuser || !user.is_staff

  return (
    <div>
      <PageHeader title={user.name || user.mobile_number} back="/admin/users" />

      <div className="px-4 pt-4 space-y-4 pb-6">
        {/* User card */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
              {(user.name || user.mobile_number)[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{user.name || '—'}</p>
                {user.is_staff && <Shield size={14} className="text-primary" />}
              </div>
              <p className="text-sm text-muted-foreground">{user.mobile_number}</p>
            </div>
          </div>

          <div className="flex gap-4 text-sm pt-1 border-t border-border">
            <div><p className="text-xs text-muted-foreground">Tickets</p><p className="font-semibold">🎫 {user.tickets}</p></div>
            <div><p className="text-xs text-muted-foreground">Status</p><p className={`font-semibold ${user.is_active ? 'text-green-600' : 'text-destructive'}`}>{user.is_active ? 'Active' : 'Inactive'}</p></div>
          </div>
        </div>

        {/* Ticket actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => setTicketSheet('add')}>
            <Ticket size={14} className="mr-1.5" /> Add Tickets
          </Button>
          <Button variant="outline" onClick={() => setTicketSheet('remove')}>
            <Ticket size={14} className="mr-1.5" /> Remove Tickets
          </Button>
        </div>

        {/* Admin actions */}
        <div className="space-y-2">
          {canClearPass && (
            <Button variant="outline" className="w-full justify-start" onClick={() => setConfirm('clear-password')}>
              <KeyRound size={14} className="mr-2" /> Clear Password
            </Button>
          )}
          {user.is_active && canDeactivate && (
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={() => setConfirm('deactivate')}>
              <Trash2 size={14} className="mr-2" /> Deactivate User
            </Button>
          )}
          {!user.is_active && (
            <Button variant="outline" className="w-full justify-start text-green-600" onClick={handleActivate} disabled={actionLoading}>
              <RotateCcw size={14} className="mr-2" /> Activate User
            </Button>
          )}
        </div>

        {/* Transactions */}
        {txData?.results.length ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Recent Transactions</h3>
            {txData.results.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-2 border-b border-border text-sm">
                <div>
                  <p className="font-medium capitalize">{tx.reason.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <span className={`font-semibold ${tx.transaction_type === 'credit' ? 'text-green-600' : 'text-destructive'}`}>
                  {tx.transaction_type === 'credit' ? '+' : '-'}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      {/* Ticket sheet */}
      <Sheet open={!!ticketSheet} onOpenChange={(v) => !v && setTicketSheet(null)}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader><SheetTitle>{ticketSheet === 'add' ? 'Add Tickets' : 'Remove Tickets'}</SheetTitle></SheetHeader>
          <form onSubmit={handleTicketSubmit} className="space-y-4 pt-4 pb-6">
            <div className="space-y-1.5"><Label>Amount</Label><Input type="number" min="1" placeholder="e.g. 10" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Note (optional)</Label><Input placeholder="Reason..." value={note} onChange={(e) => setNote(e.target.value)} /></div>
            <Button type="submit" className="w-full" disabled={!amount || addMutation.isPending || removeMutation.isPending}>
              {addMutation.isPending || removeMutation.isPending ? 'Saving...' : `${ticketSheet === 'add' ? 'Add' : 'Remove'} Tickets`}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmDialog open={confirm === 'deactivate'} onOpenChange={(v) => !v && setConfirm(null)} title="Deactivate User" description="This user will no longer be able to log in. You can reactivate later." onConfirm={handleDeactivate} loading={actionLoading} destructive />
      <ConfirmDialog open={confirm === 'clear-password'} onOpenChange={(v) => !v && setConfirm(null)} title="Clear Password" description="The user will need to set a new password on next login." onConfirm={handleClearPassword} loading={actionLoading} />
    </div>
  )
}
