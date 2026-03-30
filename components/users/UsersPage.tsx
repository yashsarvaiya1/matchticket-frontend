// components/users/UsersPage.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUsers, useCreateUser } from '@/hooks/useUsers'
import { useAuthStore } from '@/stores/authStore'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Users, ChevronRight, Shield } from 'lucide-react'

export default function UsersPage() {
  const [page, setPage]   = useState(1)
  const [open, setOpen]   = useState(false)
  const [form, setForm]   = useState({ mobile_number: '', name: '', is_staff: false })

  const { data, isLoading }  = useUsers(page)
  const createMutation       = useCreateUser()
  const isSuperuser          = useAuthStore((s) => s.is_superuser)

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(
      { mobile_number: form.mobile_number, name: form.name, is_staff: form.is_staff },
      { onSuccess: () => { setOpen(false); setForm({ mobile_number: '', name: '', is_staff: false }) } }
    )
  }

  return (
    <div>
      <PageHeader
        title="Users"
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus size={14} className="mr-1" /> Add
          </Button>
        }
      />

      <div className="px-4 pt-4 space-y-2 pb-6">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
        ) : !data?.results.length ? (
          <EmptyState icon={<Users size={28} />} title="No users yet" message="Add your first user." />
        ) : (
          <>
            {data.results.map((user) => (
              <Link key={user.id} href={`/admin/users/${user.id}`} className="block">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:shadow-sm active:scale-[0.98] transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{user.name || user.mobile_number}</p>
                      {user.is_staff && <Shield size={12} className="text-primary shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground">{user.mobile_number} · 🎫 {user.tickets}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!user.is_active && <span className="text-xs text-destructive">Inactive</span>}
                    <ChevronRight size={16} className="text-muted-foreground" />
                  </div>
                </div>
              </Link>
            ))}

            {/* Pagination */}
            <div className="flex justify-between pt-2">
              <Button variant="outline" size="sm" disabled={!data.previous} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={!data.next}     onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </>
        )}
      </div>

      {/* Add user sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader><SheetTitle>Add User</SheetTitle></SheetHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4 pb-6">
            <div className="space-y-1.5">
              <Label>Mobile Number</Label>
              <Input placeholder="Enter mobile number" value={form.mobile_number} onChange={(e) => setForm((f) => ({ ...f, mobile_number: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Name (optional)</Label>
              <Input placeholder="Enter name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            {isSuperuser && (
              <div className="flex items-center justify-between">
                <Label>Admin User</Label>
                <Switch checked={form.is_staff} onCheckedChange={(v) => setForm((f) => ({ ...f, is_staff: v }))} />
              </div>
            )}
            <Button type="submit" className="w-full" disabled={!form.mobile_number || createMutation.isPending}>
              {createMutation.isPending ? 'Adding...' : 'Add User'}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
