'use client'

import React from 'react'
import { useAuth } from '../context/AuthContext'
import { Bell, MessageCircle } from 'lucide-react'

export default function TopNavbar() {
  const { user } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-card-bg border-b border-border flex items-center justify-between px-6 z-30 ml-64 max-sm:ml-0">
      <div>
        <h2 className="text-xl font-semibold text-foreground">
          Welcome, {user?.name}!
        </h2>
        <p className="text-xs text-text-secondary capitalize">
          {user?.role} Dashboard
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-text-secondary hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="relative p-2 text-text-secondary hover:text-foreground hover:bg-gray-100 rounded-lg transition-colors">
          <MessageCircle size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
        </button>
      </div>
    </nav>
  )
}
