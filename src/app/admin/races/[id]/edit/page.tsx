'use client'

import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'
import { RaceEditForm } from '@/components/admin/race-edit-form'
import { LoadingSpinner } from '@/components/common/loading-spinner'

interface PageProps {
  params: { id: string }
}

export default function EditRacePage({ params }: PageProps) {
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
      <RaceEditForm raceId={params.id} />
    </div>
  )
}