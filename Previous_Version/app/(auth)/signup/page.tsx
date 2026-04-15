'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, GraduationCap, BookOpen } from 'lucide-react'

type Role = 'student' | 'faculty'

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
}

export default function SignupPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!selectedRole) {
      setError('Please select if you are a student or faculty')
      return
    }

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (!formData.email.toLowerCase().endsWith('@univ.edu.in')) {
      setError('Only @univ.edu.in email addresses are allowed to register')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: selectedRole
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Signup failed')
        return
      }

      // Store auth state
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user_role', data.user.role)
      localStorage.setItem('user_email', data.user.email)
      localStorage.setItem('user_name', data.user.name)

      router.push('/dashboard')
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background flex items-center justify-center p-4 py-12 overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md my-auto">
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">CampNav</h1>
            </div>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Join the campus navigation revolution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>I am registering as a…</Label>
              <div className="grid grid-cols-2 gap-2">
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
                      <span className="text-sm font-medium">{cfg.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="bg-input"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">University Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="student@univ.edu.in"
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-input"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">Must be a @univ.edu.in address</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-input"
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-input"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full mt-2" 
                disabled={isLoading || !selectedRole}
              >
                {isLoading ? 'Creating Account…' : selectedRole ? `Complete Registration as ${ROLE_CONFIG[selectedRole].label}` : 'Select a role to register'}
              </Button>

              <div className="relative pt-2">
                <div className="absolute inset-0 flex items-center pt-2">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm pt-2">
                  <span className="px-2 bg-card text-muted-foreground">Already have an account?</span>
                </div>
              </div>

              <div className="text-center pt-2">
                <Link href="/login" className="text-primary hover:underline font-medium text-sm">
                  Sign in here
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
