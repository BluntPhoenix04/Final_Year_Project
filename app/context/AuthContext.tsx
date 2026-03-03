'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type UserRole = 'student' | 'teacher' | 'admin'

interface User {
  id: string
  email: string
  role: UserRole
  name: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => void
  register: (email: string, password: string, role: UserRole, name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('campnav_user')
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      setUser(parsedUser)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (email: string, password: string, role: UserRole) => {
    // Mock authentication - in real app, this would call an API
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      role,
      name: email.split('@')[0],
    }
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('campnav_user', JSON.stringify(newUser))
  }

  const register = (email: string, password: string, role: UserRole, name: string) => {
    // Mock registration - in real app, this would call an API
    const newUser: User = {
      id: `user_${Date.now()}`,
      email,
      role,
      name,
    }
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem('campnav_user', JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('campnav_user')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
