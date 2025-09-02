'use client'

import { useCustomAuth } from '@/components/custom-auth-provider'

export function useAuth() {
  return useCustomAuth()
}