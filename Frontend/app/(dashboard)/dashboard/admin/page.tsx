'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { rooms, timetable } from '@/lib/mock-data'
import {
  ShieldCheck, Users, MapPin, Calendar, AlertTriangle, CheckCircle,
  Clock, Trash2, Wrench, BarChart3, TrendingUp, Activity, BookOpen,
  XCircle, RefreshCw, Eye
} from 'lucide-react'

// ── Types ──────────────────────────────────────────────────────────
type RoomStatus = 'available' | 'busy' | 'maintenance' | 'locked'

interface ManagedRoom {
  id: string
  name: string
  building: string
  floor: number
  capacity: number
  occupancy: number
  status: RoomStatus
  bookingCount: number   // simulated usage frequency
}

interface SupportTicket {
  id: string
  subject: string
  category: string
  status: 'open' | 'in-progress' | 'resolved'
  submittedBy: string
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

// ── Seed Data ──────────────────────────────────────────────────────
const INITIAL_ROOMS: ManagedRoom[] = rooms.map((r, i) => ({
  id: r.id,
  name: r.name,
  building: r.building,
  floor: r.floor,
  capacity: r.capacity,
  occupancy: r.occupancy,
  status: r.availability as RoomStatus,
  bookingCount: ((parseInt(r.id, 10) || i) * 7 + 3) % 25,  // deterministic varied count
}))

const MOCK_TICKETS: SupportTicket[] = [
  { id: 't1', subject: 'Projector broken in Room 301', category: 'Technical Support', status: 'open', submittedBy: 'student@university.edu', createdAt: '2026-04-13', priority: 'high' },
  { id: 't2', subject: 'AC not working in Seminar Hall', category: 'Facilities', status: 'in-progress', submittedBy: 'faculty@university.edu', createdAt: '2026-04-12', priority: 'medium' },
  { id: 't3', subject: 'Navigation map shows wrong floor', category: 'Navigation Help', status: 'open', submittedBy: 'student2@university.edu', createdAt: '2026-04-12', priority: 'low' },
  { id: 't4', subject: 'Cannot book Research Lab', category: 'Room Booking', status: 'resolved', submittedBy: 'faculty2@university.edu', createdAt: '2026-04-11', priority: 'medium' },
  { id: 't5', subject: 'Wi-Fi dropping in Library', category: 'Technical Support', status: 'open', submittedBy: 'student3@university.edu', createdAt: '2026-04-11', priority: 'high' },
]

// ── Status helpers ─────────────────────────────────────────────────
const STATUS_CONFIG: Record<RoomStatus, { label: string; color: string; bg: string }> = {
  available: { label: 'Available', color: 'text-green-700', bg: 'bg-green-100' },
  busy: { label: 'In Use', color: 'text-orange-700', bg: 'bg-orange-100' },
  maintenance: { label: 'Maintenance', color: 'text-red-700', bg: 'bg-red-100' },
  locked: { label: 'Locked', color: 'text-gray-700', bg: 'bg-gray-100' },
}

const TICKET_PRIORITY: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-blue-100 text-blue-700',
}

const TICKET_STATUS_CONFIG: Record<string, { color: string; icon: any }> = {
  open: { color: 'bg-blue-100 text-blue-700', icon: AlertTriangle },
  'in-progress': { color: 'bg-orange-100 text-orange-700', icon: Clock },
  resolved: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
}

// ── Main Component ─────────────────────────────────────────────────
export default function AdminPanelPage() {
  const router = useRouter()
  const [managedRooms, setManagedRooms] = useState<ManagedRoom[]>(INITIAL_ROOMS)
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS)
  const [allBookings, setAllBookings] = useState<any[]>([])
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const role = localStorage.getItem('user_role') || ''
    setUserRole(role)
    if (role !== 'admin') {
      router.push('/dashboard')
      return
    }
    
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const headers = { Authorization: `Bearer ${token}` }
      
      const [bRes, tRes] = await Promise.all([
        fetch('/api/bookings', { headers }),
        fetch('/api/tickets', { headers })
      ])
      
      if (bRes.ok) {
        const data = await bRes.json()
        setAllBookings(data.bookings)
      }
      
      if (tRes.ok) {
        const data = await tRes.json()
        setTickets(data.tickets)
      }
    } catch (e) {
      console.error('Failed to fetch admin data', e)
    }
  }

  // ── Analytics ──────────────────────────────────────────────────
  const analytics = useMemo(() => {
    const total = managedRooms.length
    const available = managedRooms.filter(r => r.status === 'available').length
    const inUse = managedRooms.filter(r => r.status === 'busy').length
    const maintenance = managedRooms.filter(r => r.status === 'maintenance').length
    const locked = managedRooms.filter(r => r.status === 'locked').length
    const totalCapacity = managedRooms.reduce((s, r) => s + r.capacity, 0)
    const totalOccupancy = managedRooms.reduce((s, r) => s + r.occupancy, 0)
    const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0
    const openTickets = tickets.filter(t => t.status === 'open').length
    const sortedByUsage = [...managedRooms].sort((a, b) => b.bookingCount - a.bookingCount)
    return { total, available, inUse, maintenance, locked, occupancyRate, openTickets, sortedByUsage, totalCapacity, totalOccupancy }
  }, [managedRooms, tickets])

  // ── Room status toggle ─────────────────────────────────────────
  const cycleStatus = (roomId: string) => {
    const cycle: RoomStatus[] = ['available', 'busy', 'maintenance', 'locked']
    setManagedRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r
      const idx = cycle.indexOf(r.status)
      return { ...r, status: cycle[(idx + 1) % cycle.length] }
    }))
  }

  const setStatus = (roomId: string, status: RoomStatus) => {
    setManagedRooms(prev => prev.map(r => r.id === roomId ? { ...r, status } : r))
  }

  // ── Ticket actions ─────────────────────────────────────────────
  const updateTicket = async (id: string, status: SupportTicket['status']) => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch('/api/tickets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id, status })
      })
      if (res.ok) {
        setTickets(prev => prev.map(t => (t as any)._id === id || t.id === id ? { ...t, status } : t))
      }
    } catch (e) {
      console.error(e)
    }
  }

  const deleteTicket = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`/api/tickets?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setTickets(prev => prev.filter(t => (t as any)._id !== id && t.id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  // ── Booking cancel ─────────────────────────────────────────────
  const cancelBooking = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`/api/bookings?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setAllBookings(prev => prev.filter(b => b._id !== id && b.id !== id))
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (userRole !== 'admin') return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-red-600" />
              <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            </div>
            <p className="text-muted-foreground ml-10">Full campus infrastructure control & analytics</p>
          </div>
          <Badge className="bg-red-100 text-red-700 border-red-200 text-sm px-3 py-1">⚙ Admin Access</Badge>
        </div>

        {/* KPI Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Total Rooms', value: analytics.total, icon: MapPin, color: 'text-primary', bg: 'bg-primary/10' },
            { label: 'Available', value: analytics.available, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'In Use', value: analytics.inUse, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Maintenance', value: analytics.maintenance, icon: Wrench, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Locked', value: analytics.locked, icon: XCircle, color: 'text-gray-600', bg: 'bg-gray-50' },
            { label: 'Occupancy', value: `${analytics.occupancyRate}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Open Tickets', value: analytics.openTickets, icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="overflow-hidden">
                <CardContent className="pt-4 pb-4 px-4">
                  <div className={`inline-flex p-2 rounded-lg ${stat.bg} mb-2`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <p className="text-xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-1.5" />Analytics
            </TabsTrigger>
            <TabsTrigger value="rooms">
              <MapPin className="w-4 h-4 mr-1.5" />Rooms
            </TabsTrigger>
            <TabsTrigger value="bookings">
              <Calendar className="w-4 h-4 mr-1.5" />All Bookings
            </TabsTrigger>
            <TabsTrigger value="tickets">
              <AlertTriangle className="w-4 h-4 mr-1.5" />Support
            </TabsTrigger>
          </TabsList>

          {/* ══ Analytics Tab ══════════════════════════════════════════ */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Room Usage Frequency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="w-4 h-4 text-primary" /> Room Usage Frequency
                  </CardTitle>
                  <CardDescription>Ranked by total bookings this semester</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {analytics.sortedByUsage.map((room, idx) => {
                    const pct = Math.round((room.bookingCount / (analytics.sortedByUsage[0]?.bookingCount || 1)) * 100)
                    return (
                      <div key={room.id} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-foreground flex items-center gap-1">
                            <span className="text-xs text-muted-foreground w-5">#{idx + 1}</span>
                            {room.name}
                          </span>
                          <span className="text-muted-foreground text-xs">{room.bookingCount} bookings</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className="h-2 rounded-full bg-primary transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Availability Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Activity className="w-4 h-4 text-primary" /> Availability Breakdown
                  </CardTitle>
                  <CardDescription>Current status distribution across all rooms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(
                    [
                      { label: 'Available', count: analytics.available, total: analytics.total, color: 'bg-green-500' },
                      { label: 'In Use', count: analytics.inUse, total: analytics.total, color: 'bg-orange-500' },
                      { label: 'Maintenance', count: analytics.maintenance, total: analytics.total, color: 'bg-red-500' },
                      { label: 'Locked', count: analytics.locked, total: analytics.total, color: 'bg-gray-400' },
                    ] as const
                  ).map(item => (
                    <div key={item.label} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{item.label}</span>
                        <span className="text-muted-foreground">{item.count} / {item.total}</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full transition-all duration-500 ${item.color}`}
                          style={{ width: `${Math.round((item.count / item.total) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Occupancy summary */}
                  <div className="mt-4 p-3 bg-secondary/50 rounded-lg space-y-1 border border-border">
                    <p className="text-sm font-semibold text-foreground">Overall Occupancy</p>
                    <p className="text-2xl font-bold text-primary">{analytics.occupancyRate}%</p>
                    <p className="text-xs text-muted-foreground">
                      {analytics.totalOccupancy} people across {analytics.totalCapacity} total seats
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Class Schedule Insights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="w-4 h-4 text-primary" /> Class Schedule Insights
                  </CardTitle>
                  <CardDescription>Active classes mapped by day</CardDescription>
                </CardHeader>
                <CardContent>
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
                    const count = timetable.filter(c => c.day === day).length
                    return (
                      <div key={day} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-foreground font-medium">{day}</span>
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {Array.from({ length: count }).map((_, i) => (
                              <div key={i} className="w-2 h-2 rounded-full bg-primary opacity-80" />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{count} class{count !== 1 ? 'es' : ''}</span>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* System Bookings Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="w-4 h-4 text-primary" /> System Bookings Summary
                  </CardTitle>
                  <CardDescription>All faculty bookings in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  {allBookings.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Calendar className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No bookings recorded yet</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(
                        allBookings.reduce((acc: Record<string, number>, b: any) => {
                          acc[b.roomName || 'Unknown'] = (acc[b.roomName || 'Unknown'] || 0) + 1
                          return acc
                        }, {})
                      ).map(([room, count]) => (
                        <div key={room} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                          <span className="font-medium text-foreground">{room}</span>
                          <Badge variant="secondary">{count} booking{count !== 1 ? 's' : ''}</Badge>
                        </div>
                      ))}
                      <p className="text-xs text-muted-foreground pt-2">Total: {allBookings.length} active booking{allBookings.length !== 1 ? 's' : ''}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ══ Rooms Management Tab ═══════════════════════════════════ */}
          <TabsContent value="rooms" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Room Status Management</CardTitle>
                    <CardDescription>Override availability status for any room on campus</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setManagedRooms(INITIAL_ROOMS)}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Reset All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {managedRooms.map(room => {
                    const cfg = STATUS_CONFIG[room.status]
                    return (
                      <div key={room.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-secondary/20 transition-colors">
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground text-sm">{room.name}</p>
                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color}`}>
                              {cfg.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">{room.building} · Floor {room.floor} · Cap: {room.capacity} · {room.bookingCount} bookings</p>
                        </div>
                        <div className="flex items-center gap-1.5 ml-3">
                          {(['available', 'busy', 'maintenance', 'locked'] as RoomStatus[]).map(s => (
                            <button
                              key={s}
                              onClick={() => setStatus(room.id, s)}
                              title={STATUS_CONFIG[s].label}
                              className={`w-6 h-6 rounded-full border-2 transition-all ${
                                room.status === s ? 'scale-110 border-foreground/50' : 'border-transparent opacity-50 hover:opacity-80'
                              } ${s === 'available' ? 'bg-green-500' : s === 'busy' ? 'bg-orange-500' : s === 'maintenance' ? 'bg-red-500' : 'bg-gray-400'}`}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  🟢 Available &nbsp; 🟠 In Use &nbsp; 🔴 Maintenance &nbsp; ⚫ Locked
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ All Bookings Tab ════════════════════════════════════════ */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All System Bookings</CardTitle>
                <CardDescription>View and cancel any faculty booking across the campus</CardDescription>
              </CardHeader>
              <CardContent>
                {allBookings.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground space-y-2">
                    <Calendar className="w-10 h-10 mx-auto opacity-30" />
                    <p>No active bookings in the system</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allBookings.map((booking: any, idx) => (
                      <div key={booking._id || booking.id || idx} className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-primary" />
                            <p className="font-semibold text-foreground text-sm">{booking.roomName || 'Unknown Room'}</p>
                            <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{booking.building}, Floor {booking.floor}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{booking.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{booking.startTime} – {booking.endTime}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">{booking.purpose} · {booking.attendees} attendee{booking.attendees !== 1 ? 's' : ''}</p>
                        </div>
                        <button
                          onClick={() => cancelBooking((booking as any)._id || booking.id)}
                          className="ml-3 p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
                          title="Cancel booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ══ Support Tickets Tab ═════════════════════════════════════ */}
          <TabsContent value="tickets" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Support Tickets</CardTitle>
                    <CardDescription>Manage campus helpdesk requests from students and faculty</CardDescription>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                      {tickets.filter(t => t.status === 'open').length} Open
                    </span>
                    <span className="px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-medium">
                      {tickets.filter(t => t.status === 'in-progress').length} In Progress
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tickets.map((ticket, idx) => {
                    const statusCfg = TICKET_STATUS_CONFIG[ticket.status]
                    const StatusIcon = statusCfg.icon
                    return (
                      <div key={(ticket as any)._id || ticket.id || idx} className="p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-foreground text-sm">{ticket.subject}</p>
                              <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${TICKET_PRIORITY[ticket.priority]}`}>
                                {ticket.priority}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                              <span>{ticket.category}</span>
                              <span>·</span>
                              <span>{ticket.submittedBy}</span>
                              <span>·</span>
                              <span>{ticket.createdAt}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 ml-3 shrink-0">
                            <span className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${statusCfg.color}`}>
                              <StatusIcon className="w-3 h-3" />
                              {ticket.status === 'in-progress' ? 'In Progress' : ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                          {ticket.status === 'open' && (
                            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => updateTicket((ticket as any)._id || ticket.id, 'in-progress')}>
                              <Eye className="w-3 h-3 mr-1" /> Mark In Progress
                            </Button>
                          )}
                          {ticket.status !== 'resolved' && (
                            <Button size="sm" variant="outline" className="h-7 text-xs text-green-700 border-green-200 hover:bg-green-50" onClick={() => updateTicket((ticket as any)._id || ticket.id, 'resolved')}>
                              <CheckCircle className="w-3 h-3 mr-1" /> Resolve
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive ml-auto" onClick={() => deleteTicket((ticket as any)._id || ticket.id)}>
                            <Trash2 className="w-3 h-3 mr-1" /> Delete
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
