'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { RoomCard } from '@/components/dashboard/room-card'
import { BookingModal } from '@/components/dashboard/booking-modal'
import { rooms, timetable } from '@/lib/mock-data'
import { MapPin, Clock, HelpCircle, ArrowRight, Calendar, Trash2 } from 'lucide-react'

export default function DashboardPage() {
  const [userRole, setUserRole] = useState('student')
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'student'
    setUserRole(role)
    
    // Load bookings from localStorage
    const savedBookings = localStorage.getItem('campnav_bookings')
    if (savedBookings) {
      try {
        setBookings(JSON.parse(savedBookings))
      } catch(e) {}
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('campnav_bookings', JSON.stringify(bookings))
    }
  }, [bookings, isLoaded])

  const isFaculty = userRole === 'faculty'

  const handleNavigate = (roomId: string) => {
    window.location.href = `/dashboard/navigate?roomId=${roomId}`
  }

  const handleBook = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    if (room) {
      setSelectedRoom(room)
      setBookingOpen(true)
    }
  }

  const handleConfirmBooking = (booking: any) => {
    setBookings(prev => [
      {
        ...booking,
        id: `booking-${Date.now()}`,
        createdAt: new Date(),
      },
      ...prev,
    ])
    setSelectedRoom(null)
  }

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId))
  }

  const availableRooms = rooms.filter(r => r.availability === 'available').slice(0, 4)
  const upcomingClasses = timetable.slice(0, 3)

  // Tab count: faculty gets 3 tabs (Explore, Classes, Bookings), student gets 2
  const tabGridCols = isFaculty ? 'grid-cols-3' : 'grid-cols-2'
  const maxTabsWidth = isFaculty ? 'max-w-sm' : 'max-w-xs'

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground">Welcome to CampNav</h1>
            <p className="text-muted-foreground">Navigate your campus smarter with AI-powered guidance</p>
          </div>
          {isFaculty && (
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-sm px-3 py-1">
              🎓 Faculty Access
            </Badge>
          )}
        </div>

        {/* Quick Stats */}
        <div className={`grid grid-cols-1 gap-4 ${isFaculty ? 'md:grid-cols-4' : 'md:grid-cols-3'}`}>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Available Rooms</p>
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">{rooms.filter(r => r.availability === 'available').length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Today's Classes</p>
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">{upcomingClasses.length}</p>
              </div>
            </CardContent>
          </Card>

          {/* Faculty-only: Bookings stat */}
          {isFaculty && (
            <Card className="border-blue-200 bg-blue-50/30">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">My Bookings</p>
                    <Calendar className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-700">{bookings.length}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Role</p>
                  <HelpCircle className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold capitalize">{userRole}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="explore" className="w-full">
          <TabsList className={`grid w-full ${maxTabsWidth} ${tabGridCols}`}>
            <TabsTrigger value="explore">Explore Rooms</TabsTrigger>
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            {isFaculty && <TabsTrigger value="bookings">My Bookings</TabsTrigger>}
          </TabsList>

          {/* ── Explore Rooms ── */}
          <TabsContent value="explore" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Available Rooms</CardTitle>
                    <CardDescription>
                      {isFaculty
                        ? 'Navigate to or book available classrooms and spaces'
                        : 'Navigate to available rooms on campus'}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.location.href = '/dashboard/navigate'}>
                    Open Navigator
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableRooms.map(room => (
                    <RoomCard
                      key={room.id}
                      {...room}
                      onNavigate={handleNavigate}
                      onBook={isFaculty ? handleBook : undefined}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── My Classes ── */}
          <TabsContent value="classes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your upcoming classes and events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingClasses.map(classItem => (
                  <div key={classItem.id} className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-foreground">{classItem.name}</h4>
                      <p className="text-sm text-muted-foreground">{classItem.code} · {classItem.instructor}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                        <span>{classItem.startTime} - {classItem.endTime}</span>
                        <span>{classItem.building}, Floor {classItem.floor}</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => handleNavigate(classItem.room)}>
                      Navigate
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── My Bookings (Faculty only) ── */}
          {isFaculty && (
            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>My Room Bookings</CardTitle>
                      <CardDescription>Classrooms and spaces you've booked</CardDescription>
                    </div>
                    <Button size="sm" onClick={() => {
                      // open modal with first available room pre-selected
                      const first = availableRooms[0]
                      if (first) { setSelectedRoom(first); setBookingOpen(true) }
                    }}>
                      <Calendar className="w-4 h-4 mr-2" />
                      Book a Room
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <Calendar className="w-10 h-10 text-muted-foreground mx-auto opacity-40" />
                      <p className="text-muted-foreground font-medium">No bookings yet</p>
                      <p className="text-sm text-muted-foreground">Go to Explore Rooms and click Book on any available space.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.map(booking => (
                        <div key={booking.id} className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-secondary/20 transition-colors">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <p className="font-semibold text-foreground">{booking.roomName}</p>
                              <Badge className="bg-green-100 text-green-700 text-xs">Confirmed</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{booking.building}, Floor {booking.floor}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {booking.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {booking.startTime} – {booking.endTime}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{booking.purpose} · {booking.attendees} attendee{booking.attendees !== 1 ? 's' : ''}</p>
                          </div>
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="p-1.5 rounded hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-colors"
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
          )}
        </Tabs>
      </div>

      {/* Booking Modal — faculty only */}
      {isFaculty && (
        <BookingModal
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          room={selectedRoom}
          onConfirm={handleConfirmBooking}
        />
      )}
    </DashboardLayout>
  )
}
