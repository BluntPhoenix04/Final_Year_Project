'use client'

import { useState, useEffect } from 'react'
import { Menu, X, Bell, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface NavbarProps {
  onMenuClick: () => void
  sidebarOpen: boolean
}

export function Navbar({ onMenuClick, sidebarOpen }: NavbarProps) {
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    setUserEmail(localStorage.getItem('user_email') || '')
    setUserRole(localStorage.getItem('user_role') || '')
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_role')
    localStorage.removeItem('user_email')
    localStorage.removeItem('user_name')
    window.location.href = '/login'
  }

  const getRoleBadgeColor = (role: string) => {
    return role === 'faculty' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
  }

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left: Menu button & breadcrumb */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          
          <div className="hidden sm:flex items-center gap-2">
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
            <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium', getRoleBadgeColor(userRole))}>
              {userRole === 'faculty' ? 'Faculty' : 'Student'}
            </span>
          </div>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium text-foreground truncate">{userEmail}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile Settings</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
