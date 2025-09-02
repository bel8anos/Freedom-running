'use client'

import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'
import { AdminResults } from '@/components/admin/admin-results'
import { LoadingSpinner } from '@/components/common/loading-spinner'

export default function AdminResultsPage() {
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
      <AdminResults />
    </div>
  )
}