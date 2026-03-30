// app/(dashboard)/admin/users/[id]/page.tsx
import UserDetailPage from '@/components/users/UserDetailPage'

export default function Page({ params }: { params: { id: string } }) {
  return <UserDetailPage userId={Number(params.id)} />
}
