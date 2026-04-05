'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { RoomCard } from '@/components/dashboard/room-card'
import { BookingModal } from '@/components/dashboard/booking-modal'
import { rooms, timetable, helpDeskCategories } from '@/lib/mock-data'
import { MapPin, Calendar, Clock, HelpCircle, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  const [userRole, setUserRole] = useState('student')
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    const role = localStorage.getItem('user_role') || 'student'
    setUserRole(role)
  }, [])

  const handleNavigate = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    if (room) {
      window.location.href = `/dashboard/navigate?room=${roomId}`
    }
  }

  const handleBook = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    setSelectedRoom(room)
    setBookingOpen(true)
  }

  const handleConfirmBooking = (booking: any) => {
    setBookings([...bookings, { ...booking, id: Date.now() }])
    setSelectedRoom(null)
  }

  const availableRooms = rooms.filter(r => r.availability === 'available').slice(0, 4)
  const upcomingClasses = timetable.slice(0, 3)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Welcome to CampNav</h1>
          <p className="text-muted-foreground">Navigate your campus smarter with AI-powered guidance</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <p className="text-sm text-muted-foreground">Your Bookings</p>
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <p className="text-2xl font-bold">{bookings.length}</p>
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

        {/* Main Content */}
        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="explore">Explore Rooms</TabsTrigger>
            <TabsTrigger value="classes">My Classes</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          </TabsList>

          {/* Explore Rooms */}
          <TabsContent value="explore" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Available Study Spaces</CardTitle>
                    <CardDescription>Book available rooms for your study sessions</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
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
                      onBook={handleBook}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Classes */}
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

          {/* My Bookings */}
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>Manage your room reservations</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-muted-foreground">No bookings yet. Book a room to get started!</p>
                    <Button className="mt-4" onClick={() => document.querySelector('[value="explore"]')?.click?.()}>
                      Explore Rooms
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map(booking => (
                      <div key={booking.id} className="p-3 border border-border rounded-lg">
                        <p className="font-semibold">{booking.date} · {booking.startTime} - {booking.endTime}</p>
                        <p className="text-sm text-muted-foreground">{booking.purpose} · {booking.attendees} attendees</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Modal */}
      <BookingModal
        open={bookingOpen}
        onOpenChange={setBookingOpen}
        room={selectedRoom}
        onConfirm={handleConfirmBooking}
      />
    </DashboardLayout>
  )
}
