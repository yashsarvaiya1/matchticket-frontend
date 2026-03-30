// components/shared/AppShell.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import BottomNav from './BottomNav'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router    = useRouter()
  const access    = useAuthStore((s) => s.access)
  const hydrated  = useAuthStore((s) => s._hydrated)

  useEffect(() => {
    if (hydrated && !access) {
      router.replace('/login')
    }
  }, [hydrated, access, router])

  // Wait for hydration — show nothing to avoid flash
  if (!hydrated) return null

  // Not logged in — let useEffect handle redirect
  if (!access) return null

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
