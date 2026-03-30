// hooks/useAuth.ts
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

export function useCheckNumber() {
  const setPending = useAuthStore((s) => s.setPending)
  const router     = useRouter()

  return useMutation({
    mutationFn: (mobile_number: string) => authService.checkNumber(mobile_number),
    onSuccess: (res, mobile_number) => {
      setPending({ mobile_number, ...res.data })
      router.push('/password')
    },
    onError: (err: any) => {
      const msg = err.response?.data?.detail || 'Something went wrong.'
      toast.error(msg)
    },
  })
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const router  = useRouter()

  return useMutation({
    mutationFn: ({ mobile_number, password }: { mobile_number: string; password: string }) =>
      authService.login(mobile_number, password),
    onSuccess: (res) => {
      setAuth(res.data)
      router.push('/matches')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Incorrect password.')
    },
  })
}

export function useSetPassword() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const router  = useRouter()

  return useMutation({
    mutationFn: (data: { mobile_number: string; password: string; confirm_password: string }) =>
      authService.setPassword(data.mobile_number, data.password, data.confirm_password),
    onSuccess: (res) => {
      setAuth(res.data)
      router.push('/matches')
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.detail || 'Failed to set password.')
    },
  })
}

export function useLogout() {
  const { refresh, clearAuth } = useAuthStore()
  const router = useRouter()

  return useMutation({
    mutationFn: () => authService.logout(refresh!),
    onSettled: () => {
      clearAuth()
      router.push('/login')
    },
  })
}
