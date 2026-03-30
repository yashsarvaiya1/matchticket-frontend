// app/(dashboard)/matches/[id]/scoring/page.tsx
import MatchScoringPage from '@/components/matches/MatchScoringPage'

export default function Page({ params }: { params: { id: string } }) {
  return <MatchScoringPage matchId={Number(params.id)} />
}
