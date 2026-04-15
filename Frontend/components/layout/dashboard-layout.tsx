'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Navbar } from './navbar'
import { Chatbot } from '@/components/dashboard/chatbot'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          sidebarOpen={sidebarOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  )
}
