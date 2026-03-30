// components/matches/CommonMatchesPage.tsx
'use client'

import { useState } from 'react'
import { useCommonMatches, useCreateCommonMatch } from '@/hooks/useMatches'
import { useTeams } from '@/hooks/useTeams'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Plus, BookOpen } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function CommonMatchesPage() {
  const { data: matches, isLoading } = useCommonMatches()
  const { data: teams }              = useTeams()
  const createMutation               = useCreateCommonMatch()

  const [open, setOpen]   = useState(false)
  const [form, setForm]   = useState({ team1: '', team2: '', date: '', start_time: '', end_time: '', note: '' })

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(
      { team1: Number(form.team1), team2: Number(form.team2), date: form.date, start_time: `${form.date}T${form.start_time}:00`, end_time: `${form.date}T${form.end_time}:00`, note: form.note },
      { onSuccess: () => { setOpen(false); setForm({ team1: '', team2: '', date: '', start_time: '', end_time: '', note: '' }) } }
    )
  }

  const cutoff = (startTime: string) =>
    new Date(new Date(startTime).getTime() - 3600000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

  return (
    <div>
      <PageHeader
        title="Common Matches"
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus size={14} className="mr-1" /> Create
          </Button>
        }
      />

      <div className="px-4 pt-4 space-y-3 pb-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)
        ) : !matches?.length ? (
          <EmptyState icon={<BookOpen size={28} />} title="No common matches yet" message="Create a common match to set up draws." />
        ) : (
          matches.map((cm) => (
            <div key={cm.id} className="rounded-xl border border-border bg-card p-4 space-y-2">
              <p className="font-semibold text-sm">{cm.team1_name} vs {cm.team2_name}</p>
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>📅 {new Date(cm.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p>⏰ Start: {new Date(cm.start_time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · Draws close at: {cutoff(cm.start_time)}</p>
                {cm.note && <p className="italic">{cm.note}</p>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader><SheetTitle>Create Common Match</SheetTitle></SheetHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4 pb-6">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Team 1</Label>
                <Select value={form.team1} onValueChange={(v) => setForm((f) => ({ ...f, team1: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{teams?.map((t) => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Team 2</Label>
                <Select value={form.team2} onValueChange={(v) => setForm((f) => ({ ...f, team2: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>{teams?.filter((t) => t.id.toString() !== form.team1).map((t) => <SelectItem key={t.id} value={t.id.toString()}>{t.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>Start Time</Label><Input type="time" value={form.start_time} onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>End Time</Label><Input type="time" value={form.end_time} onChange={(e) => setForm((f) => ({ ...f, end_time: e.target.value }))} /></div>
            </div>
            <div className="space-y-1.5"><Label>Note (optional)</Label><Input placeholder="Any notes..." value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} /></div>

            <Button type="submit" className="w-full" disabled={!form.team1 || !form.team2 || !form.date || !form.start_time || createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Common Match'}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
