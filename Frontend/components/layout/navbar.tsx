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
  const [hasUnread, setHasUnread] = useState(true)

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
    if (role === 'admin') return 'bg-red-100 text-red-700'
    if (role === 'faculty') return 'bg-blue-100 text-blue-700'
    return 'bg-green-100 text-green-700'
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
              {userRole === 'admin' ? '⚙ Admin' : userRole === 'faculty' ? 'Faculty' : 'Student'}
            </span>
          </div>
        </div>

        {/* Right: Notifications & Profile */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                {hasUnread && <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {hasUnread && (
                    <button 
                      onClick={() => setHasUnread(false)}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      Mark all as read
                    </button>
                )}
              </div>
              <div className="flex flex-col max-h-[300px] overflow-auto">
                {!hasUnread ? (
                  <div className="px-4 py-8 text-center text-muted-foreground">
                    <Bell className="w-8 h-8 opacity-20 mx-auto mb-2" />
                    <p className="text-sm">No new notifications</p>
                  </div>
                ) : (
                  <>
                    <div className="px-4 py-3 hover:bg-secondary/50 cursor-pointer border-b border-border/50 transition-colors">
                      <p className="text-sm font-medium text-foreground">Class starting soon</p>
                      <p className="text-xs text-muted-foreground mt-1">CS101 starts in 15 minutes at Room 101.</p>
                    </div>
                    {userRole === 'admin' && (
                      <div className="px-4 py-3 hover:bg-secondary/50 cursor-pointer border-b border-border/50 transition-colors">
                        <p className="text-sm font-medium text-foreground">New Support Ticket</p>
                        <p className="text-xs text-muted-foreground mt-1">A student reported a projector issue in Room 301.</p>
                      </div>
                    )}
                    {userRole === 'faculty' && (
                      <div className="px-4 py-3 hover:bg-secondary/50 cursor-pointer border-b border-border/50 transition-colors">
                        <p className="text-sm font-medium text-foreground">Booking Confirmed</p>
                        <p className="text-xs text-muted-foreground mt-1">Your reservation for the Library has been confirmed.</p>
                      </div>
                    )}
                    <div className="px-4 py-3 hover:bg-secondary/50 cursor-pointer transition-colors">
                      <p className="text-sm font-medium text-foreground">System Update</p>
                      <p className="text-xs text-muted-foreground mt-1">CampNav route algorithms have been updated.</p>
                    </div>
                  </>
                )}
              </div>
              {hasUnread && (
                <div 
                  className="p-2 text-center border-t border-border bg-muted/20 cursor-pointer hover:bg-muted/40 transition-colors"
                  onClick={() => setHasUnread(false)}
                >
                  <span className="text-xs text-primary font-medium">Clear Notifications</span>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

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
