'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Calendar, Clock, MapPin, User, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { timetable as fallbackTimetable } from '@/lib/mock-data'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function SchedulePage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [myTimetable, setMyTimetable] = useState<any[]>([])

  useEffect(() => {
    // Load student's own timetable from auth payload, fallback to mock
    const savedTT = localStorage.getItem('user_timetable')
    if (savedTT) {
      try {
        const parsed = JSON.parse(savedTT)
        setMyTimetable(parsed.length > 0 ? parsed : fallbackTimetable)
      } catch {
        setMyTimetable(fallbackTimetable)
      }
    } else {
      setMyTimetable(fallbackTimetable)
    }

    // Fetch live system bookings
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        const res = await fetch('/api/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setBookings(data.bookings)
        }
      } catch (e) {}
    }
    fetchBookings()
  }, [])

  // Convert bookings into timetable-like format
  const mappedBookings = bookings.map(b => {
    // Parse the date to get the weekday (e.g., 'Monday')
    let dayName = 'Monday'
    if (b.date) {
      const d = new Date(b.date)
      dayName = d.toLocaleDateString('en-US', { weekday: 'long' })
    }

    return {
      id: b._id || b.id,
      name: b.purpose,
      code: 'Booking',
      instructor: `${b.attendees} Attendee(s)`,
      day: dayName,
      startTime: b.startTime,
      endTime: b.endTime,
      room: b.roomId,
      roomName: b.roomName,
      building: b.building,
      floor: b.floor,
      isBooking: true,
      date: b.date,
    }
  })

  // Merge timetable and mapped bookings
  const combinedSchedule = [...myTimetable, ...mappedBookings]

  const getClassesByDay = (day: string) => {
    return combinedSchedule.filter(c => c.day === day).sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const handleNavigate = (roomId: string) => {
    router.push(`/dashboard/navigate?roomId=${roomId}`)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Class Schedule</h1>
          <p className="text-muted-foreground">View your timetable and navigate to classes</p>
        </div>

        {/* Weekly View */}
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
            <CardDescription>Your classes for the week</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="Monday" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {days.map(day => (
                  <TabsTrigger key={day} value={day}>
                    {day.slice(0, 3)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {days.map(day => (
                <TabsContent key={day} value={day} className="space-y-3">
                  {getClassesByDay(day).length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                      <p className="text-muted-foreground">No classes on {day}</p>
                    </div>
                  ) : (
                    getClassesByDay(day).map(classItem => (
                      <div
                        key={classItem._id || classItem.id || Math.random().toString()}
                        className="p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-secondary/30 transition-all"
                      >
                        <div className="space-y-3">
                          {/* Class Info */}
                          <div className="flex items-start justify-between">
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-foreground">{classItem.name}</h3>
                                <Badge variant="outline">{classItem.code}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{classItem.instructor}</p>
                            </div>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-4 h-4" />
                              <span>{classItem.startTime} - {classItem.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{classItem.isBooking ? classItem.roomName : `Room ${classItem.room}`}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="w-4 h-4" />
                              <span>{classItem.building}</span>
                            </div>
                          </div>

                          {/* Location Details */}
                          <div className="text-xs text-muted-foreground bg-secondary/30 rounded p-2">
                            {classItem.building}, Floor {classItem.floor}
                            {classItem.isBooking && classItem.date && ` · ${classItem.date}`}
                          </div>

                          {/* Action */}
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={() => handleNavigate(classItem.room)}
                          >
                            Navigate to {classItem.isBooking ? classItem.roomName : `Room ${classItem.room}`}
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Your next 5 classes and bookings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {combinedSchedule.slice(0, 5).map((classItem, idx) => (
              <div
                key={classItem._id || classItem.id || idx}
                className={`flex items-center justify-between p-3 border rounded-lg ${
                  classItem.isBooking ? 'border-primary/50 bg-primary/5' : 'border-border'
                }`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{classItem.name}</p>
                    {classItem.isBooking && (
                      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider py-0 px-1.5 h-4 bg-primary text-primary-foreground">
                        Booked
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {classItem.isBooking ? classItem.date : classItem.day} at {classItem.startTime} · Room {classItem.room || (classItem as any).roomName}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleNavigate(classItem.room)}
                >
                  Navigate
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
