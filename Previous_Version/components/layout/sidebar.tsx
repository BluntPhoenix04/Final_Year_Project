'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { MapPin, Home, Map, MessageSquare, Clock, LogOut, Settings, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    setUserRole(localStorage.getItem('user_role') || '')
  }, [])

  const baseNavItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', id: 'dashboard' },
    { icon: Map, label: 'Navigate', href: '/dashboard/navigate', id: 'navigate' },
    { icon: Clock, label: 'Schedule', href: '/dashboard/schedule', id: 'schedule' },
    { icon: MessageSquare, label: 'Help Desk', href: '/dashboard/helpdesk', id: 'helpdesk' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings', id: 'settings' },
  ]

  const adminNavItems = [
    { icon: ShieldCheck, label: 'Admin Panel', href: '/dashboard/admin', id: 'admin' },
  ]

  const navItems = userRole === 'admin' ? [...baseNavItems, ...adminNavItems] : baseNavItems

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_role')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_name')
    window.location.href = '/login'
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        'fixed lg:relative top-0 left-0 h-screen w-64 bg-card border-r border-border transform transition-transform duration-300 z-40',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 mb-8 group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-foreground">CampNav</h2>
              <p className="text-xs text-muted-foreground">
                {userRole === 'admin' ? 'Admin Console' : 'Navigate Smart'}
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon
              const isActive = item.href === '/dashboard' 
                ? pathname === '/dashboard' 
                : pathname === item.href || pathname.startsWith(item.href + '/')
              const isAdminItem = item.id === 'admin'
              
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors group',
                    isActive
                      ? isAdminItem ? 'bg-red-600 text-white' : 'bg-primary text-primary-foreground'
                      : isAdminItem
                        ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-semibold border border-red-200 dark:border-red-900/50'
                        : 'text-foreground hover:bg-secondary'
                  )}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-border pt-4">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
