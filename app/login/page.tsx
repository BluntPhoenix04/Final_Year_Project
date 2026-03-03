'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, type UserRole } from '../context/AuthContext'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('student')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      login(email, password, role)
      // Redirect based on role
      if (role === 'student') {
        router.push('/student')
      } else if (role === 'teacher') {
        router.push('/teacher')
      } else {
        router.push('/admin')
      }
    } catch (err) {
      setError('Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-lg mb-4">
            <span className="text-white text-xl font-bold">C</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">CampNav</h1>
          <p className="text-text-secondary">Smart Campus Navigation System</p>
        </div>

        {/* Login Card */}
        <div className="bg-card-bg rounded-xl shadow-card p-8 mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">Welcome Back</h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Role Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-3">Login As</label>
              <div className="grid grid-cols-3 gap-3">
                {(['student', 'teacher', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-3 rounded-lg font-medium capitalize transition-all ${
                      role === r
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-foreground hover:bg-gray-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-4 rounded-lg transition-colors mb-4"
            >
              Sign In
            </button>
          </form>

          {/* Register Link */}
          <p className="text-center text-text-secondary text-sm">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:text-primary-dark font-semibold">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials:</p>
          <div className="space-y-1 text-xs text-blue-800">
            <p><strong>All roles:</strong> demo@example.com / password</p>
          </div>
        </div>
      </div>
    </div>
  )
}
