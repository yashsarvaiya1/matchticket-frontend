// components/matches/MatchDetailPage.tsx
'use client'

import { useState } from 'react'
import { useMatch, useActivateMatch, useEndMatch, useRevealWinner } from '@/hooks/useMatches'
import { useAuthStore } from '@/stores/authStore'
import PageHeader from '@/components/shared/PageHeader'
import MatchInfoTab from './MatchInfoTab'
import MatchDrawsTab from './MatchDrawsTab'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function MatchDetailPage({ matchId }: { matchId: number }) {
  const { data: match, isLoading } = useMatch(matchId)
  const isAdmin    = useAuthStore((s) => s.isAdmin())
  const isOwner    = useAuthStore((s) => s.is_superuser || (match?.created_by != null))

  const activateMutation    = useActivateMatch()
  const endMutation         = useEndMatch()
  const revealMutation      = useRevealWinner()

  if (isLoading) return (
    <div className="p-4 space-y-4">
      <Skeleton className="h-14 rounded-xl" />
      <Skeleton className="h-48 rounded-xl" />
    </div>
  )

  if (!match) return <div className="p-8 text-center text-muted-foreground text-sm">Match not found.</div>

  return (
    <div>
      <PageHeader
        title={`${match.team1_name} vs ${match.team2_name}`}
        back="/matches"
      />

      <Tabs defaultValue="info" className="px-4 pt-4">
        <TabsList className="w-full">
          <TabsTrigger value="info"  className="flex-1">Info</TabsTrigger>
          <TabsTrigger value="draws" className="flex-1">My Draws</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="pt-4">
          <MatchInfoTab match={match} />
        </TabsContent>

        <TabsContent value="draws" className="pt-4">
          <MatchDrawsTab match={match} />
        </TabsContent>
      </Tabs>

      {/* Admin action bar */}
      {isAdmin && (
        <div className="fixed bottom-20 left-0 right-0 px-4 pb-2 flex gap-2">
          {match.status === 'upcoming' && (
            <Button className="flex-1" onClick={() => activateMutation.mutate(matchId)} disabled={activateMutation.isPending}>
              Activate
            </Button>
          )}
          {match.status === 'draw_closed' && (
            <Button className="flex-1" variant="destructive" onClick={() => endMutation.mutate(matchId)} disabled={endMutation.isPending}>
              End Match
            </Button>
          )}
          {match.status === 'ended' && (
            <Button className="flex-1" onClick={() => revealMutation.mutate(matchId)} disabled={revealMutation.isPending}>
              Reveal Winner 🏆
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
