'use client'

import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'
import { AdminRegistrations } from '@/components/admin/admin-registrations'
import { LoadingSpinner } from '@/components/common/loading-spinner'

export default function AdminRegistrationsPage() {
  const { data: session, status } = useAuth()

  if (status === 'loading') {
    return (
      <div className="py-8">
        <div className="flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    )
  }

  if (!session || session.user.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="py-8">
      <AdminRegistrations />
    </div>
  )
}