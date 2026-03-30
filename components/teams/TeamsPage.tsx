// components/teams/TeamsPage.tsx
'use client'

import { useState } from 'react'
import { useTeams, useCreateTeam, usePlayers, useCreatePlayer } from '@/hooks/useTeams'
import PageHeader from '@/components/shared/PageHeader'
import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Shield, UserPlus } from 'lucide-react'
import type { TeamList } from '@/models/team'

const ICONS = ['lion', 'tiger', 'eagle', 'shark', 'wolf', 'dragon', 'falcon', 'panther']

export default function TeamsPage() {
  const { data: teams, isLoading } = useTeams()
  const createTeamMutation         = useCreateTeam()
  const [selectedTeam, setSelectedTeam] = useState<TeamList | null>(null)

  const [teamSheet,   setTeamSheet]   = useState(false)
  const [playerSheet, setPlayerSheet] = useState(false)
  const [teamForm,    setTeamForm]    = useState({ name: '', icon: 'lion' })
  const [playerName,  setPlayerName]  = useState('')

  const { data: players }      = usePlayers(selectedTeam?.id)
  const createPlayerMutation   = useCreatePlayer()

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault()
    createTeamMutation.mutate({ name: teamForm.name, icon: `${teamForm.icon}.svg` }, {
      onSuccess: () => { setTeamSheet(false); setTeamForm({ name: '', icon: 'lion' }) },
    })
  }

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam) return
    createPlayerMutation.mutate({ name: playerName, team: selectedTeam.id }, {
      onSuccess: () => { setPlayerSheet(false); setPlayerName('') },
    })
  }

  return (
    <div>
      <PageHeader
        title="Teams & Players"
        actions={
          <Button size="sm" onClick={() => setTeamSheet(true)}>
            <Plus size={14} className="mr-1" /> Team
          </Button>
        }
      />

      <div className="px-4 pt-4 space-y-3 pb-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)
        ) : !teams?.length ? (
          <EmptyState icon={<Shield size={28} />} title="No teams yet" message="Create your first team." />
        ) : (
          teams.map((team) => (
            <div key={team.id} className={`rounded-xl border bg-card p-4 space-y-3 cursor-pointer transition-all ${selectedTeam?.id === team.id ? 'border-primary shadow-sm' : 'border-border'}`} onClick={() => setSelectedTeam(selectedTeam?.id === team.id ? null : team)}>
              <div className="flex items-center gap-3">
                <div className="text-2xl">🏏</div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{team.name}</p>
                  <p className="text-xs text-muted-foreground">{team.icon}</p>
                </div>
              </div>

              {/* Players for selected team */}
              {selectedTeam?.id === team.id && (
                <div className="space-y-2 pt-1 border-t border-border" onClick={(e) => e.stopPropagation()}>
                  {players?.map((p) => (
                    <div key={p.id} className="flex items-center justify-between text-sm py-1">
                      <span>{p.name}</span>
                      {!p.is_active && <span className="text-xs text-muted-foreground">Inactive</span>}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => setPlayerSheet(true)}>
                    <UserPlus size={13} className="mr-1.5" /> Add Player
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create team sheet */}
      <Sheet open={teamSheet} onOpenChange={setTeamSheet}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader><SheetTitle>Create Team</SheetTitle></SheetHeader>
          <form onSubmit={handleCreateTeam} className="space-y-4 pt-4 pb-6">
            <div className="space-y-1.5"><Label>Team Name</Label><Input placeholder="e.g. KKR" value={teamForm.name} onChange={(e) => setTeamForm((f) => ({ ...f, name: e.target.value }))} /></div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-4 gap-2">
                {ICONS.map((icon) => (
                  <button key={icon} type="button" onClick={() => setTeamForm((f) => ({ ...f, icon }))}
                    className={`p-3 rounded-lg border text-xs font-medium transition-all ${teamForm.icon === icon ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-foreground'}`}>
                    {icon}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={!teamForm.name || createTeamMutation.isPending}>
              {createTeamMutation.isPending ? 'Creating...' : 'Create Team'}
            </Button>
          </form>
        </SheetContent>
      </Sheet>

      {/* Add player sheet */}
      <Sheet open={playerSheet} onOpenChange={setPlayerSheet}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader><SheetTitle>Add Player to {selectedTeam?.name}</SheetTitle></SheetHeader>
          <form onSubmit={handleAddPlayer} className="space-y-4 pt-4 pb-6">
            <div className="space-y-1.5"><Label>Player Name</Label><Input placeholder="e.g. Rohit Sharma" value={playerName} onChange={(e) => setPlayerName(e.target.value)} /></div>
            <Button type="submit" className="w-full" disabled={!playerName || createPlayerMutation.isPending}>
              {createPlayerMutation.isPending ? 'Adding...' : 'Add Player'}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
