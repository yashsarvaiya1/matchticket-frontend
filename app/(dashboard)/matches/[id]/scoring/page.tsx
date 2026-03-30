// app/(dashboard)/matches/[id]/scoring/page.tsx
import MatchScoringPage from '@/components/matches/MatchScoringPage'

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const resolvedParams = await params
  return <MatchScoringPage matchId={Number(resolvedParams.id)} />
}
