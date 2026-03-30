// components/auth/PasswordPage.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useLogin, useSetPassword } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { ChevronLeft } from 'lucide-react'

export default function PasswordPage() {
  const router  = useRouter()
  const pending = useAuthStore((s) => s.pending)

  const [password, setPassword]   = useState('')
  const [confirm,  setConfirm]    = useState('')

  const loginMutation       = useLogin()
  const setPasswordMutation = useSetPassword()

  useEffect(() => {
    if (!pending) router.replace('/login')
  }, [pending, router])

  if (!pending) return null

  const isSettingPassword = !pending.password_set
  const isPending         = loginMutation.isPending || setPasswordMutation.isPending

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSettingPassword) {
      setPasswordMutation.mutate({ mobile_number: pending.mobile_number, password, confirm_password: confirm })
    } else {
      loginMutation.mutate({ mobile_number: pending.mobile_number, password })
    }
  }

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm space-y-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft size={16} /> Back
        </button>

        <div className="space-y-1">
          <h1 className="text-xl font-bold">
            {isSettingPassword ? 'Set your password' : `Welcome back${pending.name ? ', ' + pending.name : ''}`}
          </h1>
          <p className="text-sm text-muted-foreground">{pending.mobile_number}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">{isSettingPassword ? 'New Password' : 'Password'}</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
              autoFocus
            />
          </div>

          {isSettingPassword && (
            <div className="space-y-1.5">
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                disabled={isPending}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!password || (isSettingPassword && !confirm) || isPending}>
            {isPending ? 'Please wait...' : isSettingPassword ? 'Set Password' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  )
}
