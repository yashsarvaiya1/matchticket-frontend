// components/users/UsersPage.tsx
'use client'

import { useState } from 'react'
import { useUsers, useCreateUser } from '@/hooks/useUsers'
import { useAuthStore } from '@/stores/authStore'
import PageHeader from '@/components/shared/PageHeader'
import Link from 'next/link'
import { Shield, Plus, ChevronRight, Ticket } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'

export default function UsersPage() {
  const { data, isLoading }   = useUsers()
  const isSuperuser            = useAuthStore((s) => s.is_superuser)
  const createMutation         = useCreateUser()

  const [addSheet, setAddSheet]   = useState(false)
  const [mobile,   setMobile]     = useState('')
  const [name,     setName]       = useState('')
  const [isAdmin,  setIsAdmin]    = useState(false)

  const users = data?.results ?? []

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(
      { mobile_number: mobile, name, is_staff: isAdmin },
      {
        onSuccess: () => {
          setAddSheet(false)
          setMobile(''); setName(''); setIsAdmin(false)
        },
      }
    )
  }

  return (
    <div>
      <PageHeader
        title="Users"
        actions={
          <Button size="sm" variant="ghost" onClick={() => setAddSheet(true)}>
            <Plus size={18} />
          </Button>
        }
      />

      <div className="px-4 pt-4 space-y-2 pb-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">No users found.</div>
        ) : (
          users.map((user) => (
            <Link key={user.id} href={`/admin/users/${user.id}`} className="block">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:shadow-sm active:scale-[0.98] transition-all">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                  {(user.name || user.mobile_number)[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="font-medium text-sm truncate">{user.name || '—'}</p>
                    {user.is_staff && <Shield size={12} className="text-primary shrink-0" />}
                    {!user.is_active && <span className="text-xs text-destructive shrink-0">(Inactive)</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{user.mobile_number}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                  <Ticket size={12} />
                  <span>{user.tickets}</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Add User Sheet */}
      <Sheet open={addSheet} onOpenChange={setAddSheet}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader><SheetTitle>Add User</SheetTitle></SheetHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4 pb-6">
            <div className="space-y-1.5">
              <Label>Mobile Number *</Label>
              <Input placeholder="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            {isSuperuser && (
              <div className="flex items-center justify-between">
                <Label>Make Admin</Label>
                <span className="text-xs">{String(isAdmin)}</span>
                <Switch id="is-admin" checked={isAdmin} onCheckedChange={(checked) => setIsAdmin(checked)} />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={!mobile || createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create User'}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
