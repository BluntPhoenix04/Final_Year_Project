'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, GraduationCap, BookOpen, ShieldCheck } from 'lucide-react'

type Role = 'student' | 'faculty' | 'admin'

const ROLE_CONFIG: Record<Role, { label: string; icon: any; color: string; border: string; bg: string }> = {
  student: {
    label: 'Student',
    icon: GraduationCap,
    color: 'text-green-700',
    border: 'border-green-500',
    bg: 'bg-green-50 dark:bg-green-950/30',
  },
  faculty: {
    label: 'Faculty',
    icon: BookOpen,
    color: 'text-blue-700',
    border: 'border-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  admin: {
    label: 'Admin',
    icon: ShieldCheck,
    color: 'text-red-700',
    border: 'border-red-500',
    bg: 'bg-red-50 dark:bg-red-950/30',
  },
}

export default function LoginPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedRole) { setError('Please select your role first'); return }
    if (!email || !password) { setError('Please fill in all fields'); return }
    if (!email.toLowerCase().endsWith('@univ.edu.in')) {
      setError('Only @univ.edu.in email addresses are allowed')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        return
      }

      // Store JWT and user info
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_role', data.user.role)
      localStorage.setItem('user_email', data.user.email)
      localStorage.setItem('user_name', data.user.name)
      localStorage.setItem('user_timetable', JSON.stringify(data.user.timetable || []))

      router.push('/dashboard')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">CampNav</h1>
            </div>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>
              Sign in to access campus navigation and smart helpdesk
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Role selection buttons */}
            <div className="space-y-2">
              <Label>I am a…</Label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([role, cfg]) => {
                  const Icon = cfg.icon
                  const isActive = selectedRole === role
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => { setSelectedRole(role); setError('') }}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all ${
                        isActive
                          ? `${cfg.border} ${cfg.bg} ${cfg.color} font-semibold`
                          : 'border-border text-muted-foreground hover:border-border/80 hover:bg-secondary/50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{cfg.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@univ.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-input"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">Must be a @univ.edu.in address</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-input"
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !selectedRole}>
                {isLoading ? 'Signing in…' : selectedRole ? `Sign in as ${ROLE_CONFIG[selectedRole].label}` : 'Select a role to continue'}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-card text-muted-foreground">New to CampNav?</span>
                </div>
              </div>

              <Link href="/signup">
                <Button type="button" variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </form>

            {/* Demo hints */}
            <div className="p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground space-y-1 border border-border/50">
              <p className="font-semibold text-foreground mb-1">Demo Accounts</p>
              <p>🎓 alice@univ.edu.in · Student@123</p>
              <p>📖 dr.smith@univ.edu.in · Faculty@123</p>
              <p>⚙️ admin@univ.edu.in · Admin@123</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
