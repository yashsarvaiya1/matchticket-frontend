// components/matches/MatchScoringPage.tsx
'use client'

import { useState } from 'react'
import { useMatch, useUpdatePosition, usePositions } from '@/hooks/useMatches'
import { usePlayers } from '@/hooks/useTeams'
import PageHeader from '@/components/shared/PageHeader'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import { Label }  from '@/components/ui/label'
import { toast }  from 'sonner'

export default function MatchScoringPage({ matchId }: { matchId: number }) {
  const { data: match }     = useMatch(matchId)
  const { data: positions } = usePositions(matchId)
  const updatePosition      = useUpdatePosition(matchId)

  const { data: team1Players } = usePlayers(match?.team1)
  const { data: team2Players } = usePlayers(match?.team2)

  const [scope, setScope]   = useState<'mine' | 'all'>('mine')
  const [scores, setScores] = useState<Record<number, { player: number | null; score: string }>>({})

  if (!match || !positions) return <div className="p-4"><Skeleton className="h-48 rounded-xl" /></div>

  const getTeamPlayers = (slot: number) => slot <= 5 ? (team1Players ?? []) : (team2Players ?? [])

  const handleSave = async () => {
    const dirty = Object.entries(scores).filter(([, v]) => v.player !== undefined || v.score !== undefined)
    if (dirty.length === 0) { toast.info('No changes to save.'); return }

    for (const [posId, data] of dirty) {
      await updatePosition.mutateAsync({
        id:    Number(posId),
        data:  { player: data.player ?? null, score: data.score || null },
        scope,
      })
    }
    toast.success(`Positions saved (${scope === 'all' ? 'all matches' : 'this match'}).`)
    setScores({})
  }

  const renderSection = (slots: number[], teamName: string) => (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{teamName}</h3>
      {slots.map((slot) => {
        const pos     = positions.find((p) => p.slot === slot)
        if (!pos) return null
        const current = scores[pos.id]
        const players = getTeamPlayers(slot)

        return (
          <div key={pos.id} className="flex items-center gap-2 py-2 border-b border-border">
            <span className="font-mono text-xs text-muted-foreground w-14">{pos.position_label}</span>

            <Select
              value={current?.player?.toString() ?? pos.player?.toString() ?? ''}
              onValueChange={(v) => setScores((prev) => ({ ...prev, [pos.id]: { ...prev[pos.id], player: v ? Number(v) : null, score: prev[pos.id]?.score ?? pos.score ?? '' } }))}
            >
              <SelectTrigger className="flex-1 h-9 text-xs">
                <SelectValue placeholder="Select player" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Player</SelectItem>
                {players.map((p) => (
                  <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              className="w-20 h-9 text-xs text-right"
              type="number"
              placeholder="Score"
              value={current?.score ?? pos.score ?? ''}
              onChange={(e) => setScores((prev) => ({
                ...prev,
                [pos.id]: { ...prev[pos.id], player: prev[pos.id]?.player ?? pos.player ?? null, score: e.target.value },
              }))}
            />
          </div>
        )
      })}
    </div>
  )

  return (
    <div>
      <PageHeader title="Enter Scores" back={`/matches/${matchId}`} />

      <div className="px-4 pt-4 space-y-6 pb-32">
        {/* Scope toggle */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
          <Label htmlFor="scope" className="text-sm">
            {scope === 'all' ? 'Update all linked matches' : 'Update this match only'}
          </Label>
          <Switch
            id="scope"
            checked={scope === 'all'}
            onCheckedChange={(v) => setScope(v ? 'all' : 'mine')}
          />
        </div>

        {scope === 'all' && (
          <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
            ⚠️ This will update player & score for all matches on the same CommonMatch date.
          </p>
        )}

        {renderSection([1, 2, 3, 4, 5], match.team1_name)}
        {renderSection([6, 7, 8, 9, 10], match.team2_name)}
      </div>

      {/* Sticky save */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border px-4 py-3">
        <Button className="w-full" onClick={handleSave} disabled={updatePosition.isPending}>
          {updatePosition.isPending ? 'Saving...' : `Save · ${scope === 'all' ? 'All Matches' : 'This Match'}`}
        </Button>
      </div>
    </div>
  )
}
