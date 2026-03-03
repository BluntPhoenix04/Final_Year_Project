'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import TopNavbar from './TopNavbar'
import Chatbot from './Chatbot'

interface DashboardLayoutProps {
  children: React.ReactNode
  requiredRole?: 'student' | 'teacher' | 'admin'
}

export default function DashboardLayout({
  children,
  requiredRole,
}: DashboardLayoutProps) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    } else if (requiredRole && user?.role !== requiredRole) {
      // Redirect to appropriate dashboard if user has wrong role
      router.push(`/${user?.role}`)
    }
  }, [isAuthenticated, user, router, requiredRole])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNavbar />
      <main className="pt-20 pb-20 ml-64 max-sm:ml-0 max-sm:pt-20 p-6">
        {children}
      </main>
      <Chatbot />
    </div>
  )
}
