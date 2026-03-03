'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role
      if (user.role === 'student') {
        router.push('/student')
      } else if (user.role === 'teacher') {
        router.push('/teacher')
      } else if (user.role === 'admin') {
        router.push('/admin')
      }
    } else {
      // Redirect to login if not authenticated
      router.push('/login')
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">CampNav</h1>
        <p className="text-text-secondary">Redirecting...</p>
      </div>
    </div>
  )
}
