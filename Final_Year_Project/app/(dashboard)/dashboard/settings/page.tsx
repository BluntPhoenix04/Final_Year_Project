'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Bell, Globe, Lock, LogOut } from 'lucide-react'

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState('')
  const [userRole, setUserRole] = useState('')
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [locationSharing, setLocationSharing] = useState(true)

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

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Email Address</Label>
              <p className="text-sm font-medium text-foreground">{userEmail}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Account Type</Label>
              <p className="text-sm font-medium text-foreground capitalize">{userRole}</p>
            </div>
            <Button variant="outline" disabled>
              Edit Profile (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Control how you receive updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <div className="space-y-0.5">
                  <Label className="font-medium">Push Notifications</Label>
                  <p className="text-xs text-muted-foreground">Get alerts for class changes and room availability</p>
                </div>
              </div>
              <Switch checked={notifications} onChange={setNotifications} />
            </div>
            
            <div className="border-t border-border pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div className="space-y-0.5">
                    <Label className="font-medium">Location Sharing</Label>
                    <p className="text-xs text-muted-foreground">Allow real-time navigation assistance</p>
                  </div>
                </div>
                <Switch checked={locationSharing} onChange={setLocationSharing} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy & Security</CardTitle>
            <CardDescription>Manage your data and account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
              <Lock className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Password Protection</p>
                <p className="text-xs text-muted-foreground">Your account is secured with end-to-end encryption</p>
              </div>
            </div>
            <Button variant="outline" disabled>
              Change Password (Coming Soon)
            </Button>
            <Button variant="outline" disabled>
              Two-Factor Authentication (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how CampNav looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="font-medium">Dark Mode</Label>
                <p className="text-xs text-muted-foreground">Coming soon in a future update</p>
              </div>
              <Switch checked={darkMode} onChange={setDarkMode} disabled />
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            <Button
              variant="outline"
              disabled
              className="w-full opacity-50 border-destructive/50"
            >
              Delete Account (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
