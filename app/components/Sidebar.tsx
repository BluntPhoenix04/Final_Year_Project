'use client'

import React, { useState } from 'react'
import { useAuth, type UserRole } from '../context/AuthContext'
import Link from 'next/link'
import { Menu, X, LogOut, Settings } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface SidebarLink {
  label: string
  href: string
  icon: React.ReactNode
  roles: UserRole[]
}

const sidebarLinks: SidebarLink[] = [
  {
    label: 'Dashboard',
    href: '#dashboard',
    icon: '📊',
    roles: ['student', 'teacher', 'admin'],
  },
  {
    label: 'Timetable',
    href: '#timetable',
    icon: '📅',
    roles: ['student', 'teacher'],
  },
  {
    label: 'Live Navigation',
    href: '#navigation',
    icon: '🗺️',
    roles: ['student', 'teacher', 'admin'],
  },
  {
    label: 'Bookings',
    href: '#bookings',
    icon: '📑',
    roles: ['teacher'],
  },
  {
    label: 'Help Desk',
    href: '#helpdesk',
    icon: '❓',
    roles: ['student', 'teacher', 'admin'],
  },
  {
    label: 'Settings',
    href: '#settings',
    icon: '⚙️',
    roles: ['student', 'teacher', 'admin'],
  },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  const filteredLinks = sidebarLinks.filter((link) =>
    user?.role ? link.roles.includes(user.role) : false
  )

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden max-sm:flex fixed top-4 left-4 z-50 items-center justify-center w-10 h-10 bg-primary text-white rounded-lg"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-card-bg border-r border-border transition-transform duration-300 z-40 max-sm:${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="mb-8 mt-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">CampNav</h1>
                <p className="text-xs text-text-secondary">Campus Navigator</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-2">
            {filteredLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  // Scroll to section if on same page
                  const section = document.querySelector(link.href)
                  if (section) {
                    section.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:bg-gray-50 hover:text-foreground transition-colors text-left"
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-medium">{link.label}</span>
              </button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-border pt-4">
            <div className="mb-4 px-4">
              <p className="text-xs text-text-secondary mb-1">Logged in as</p>
              <p className="font-semibold text-foreground capitalize text-sm">{user?.name}</p>
              <p className="text-xs text-text-secondary capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="hidden max-sm:block fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
