'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { timetable } from '@/lib/mock-data'
import { Calendar, Clock, MapPin, User, ArrowRight } from 'lucide-react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export default function SchedulePage() {
  const getClassesByDay = (day: string) => {
    return timetable.filter(c => c.day === day)
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
                        key={classItem.id}
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
                              <span>{classItem.room}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <User className="w-4 h-4" />
                              <span>{classItem.building}</span>
                            </div>
                          </div>

                          {/* Location Details */}
                          <div className="text-xs text-muted-foreground bg-secondary/30 rounded p-2">
                            {classItem.building}, Floor {classItem.floor}
                          </div>

                          {/* Action */}
                          <Button size="sm" className="w-full">
                            Navigate to Class
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
            <CardDescription>Your next 5 classes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {timetable.slice(0, 5).map(classItem => (
              <div
                key={classItem.id}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="space-y-1 flex-1">
                  <p className="font-medium text-foreground">{classItem.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {classItem.day} at {classItem.startTime} · {classItem.room}
                  </p>
                </div>
                <Button size="sm" variant="outline">Navigate</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
