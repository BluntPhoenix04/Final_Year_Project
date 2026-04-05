'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { RoomCard } from '@/components/dashboard/room-card'
import { BookingModal } from '@/components/dashboard/booking-modal'
import { rooms } from '@/lib/mock-data'
import { Search, Filter } from 'lucide-react'

export default function RoomsPage() {
  const [searchInput, setSearchInput] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [filterBuilding, setFilterBuilding] = useState<string | null>(null)

  const availableRooms = rooms.filter(r => r.availability === 'available')
  const busyRooms = rooms.filter(r => r.availability === 'busy')

  const filteredRooms = (roomList: any[]) => {
    return roomList.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(searchInput.toLowerCase()) ||
                          room.building.toLowerCase().includes(searchInput.toLowerCase()) ||
                          room.id.toLowerCase().includes(searchInput.toLowerCase())
      const matchesBuilding = !filterBuilding || room.building === filterBuilding

      return matchesSearch && matchesBuilding
    })
  }

  const handleBook = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId)
    setSelectedRoom(room)
    setBookingOpen(true)
  }

  const handleNavigate = (roomId: string) => {
    window.location.href = `/dashboard/navigate?room=${roomId}`
  }

  const buildings = Array.from(new Set(rooms.map(r => r.building)))
  const occupancyStats = {
    total: rooms.length,
    available: availableRooms.length,
    occupied: busyRooms.length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Study Spaces & Rooms</h1>
          <p className="text-muted-foreground">Find and book available rooms across campus</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Rooms</p>
                <p className="text-3xl font-bold">{occupancyStats.total}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Available Now</p>
                <p className="text-3xl font-bold text-green-600">{occupancyStats.available}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">In Use</p>
                <p className="text-3xl font-bold text-orange-600">{occupancyStats.occupied}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Rooms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms, buildings..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 bg-secondary"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filterBuilding || ''}
                  onChange={(e) => setFilterBuilding(e.target.value || null)}
                  className="px-3 py-2 border border-border rounded-lg bg-input text-foreground text-sm"
                >
                  <option value="">All Buildings</option>
                  {buildings.map(building => (
                    <option key={building} value={building}>
                      {building}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rooms Grid */}
        <Tabs defaultValue="available" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="available">
              Available ({availableRooms.length})
            </TabsTrigger>
            <TabsTrigger value="busy">
              In Use ({busyRooms.length})
            </TabsTrigger>
          </TabsList>

          {/* Available Rooms */}
          <TabsContent value="available" className="space-y-6">
            {filteredRooms(availableRooms).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No available rooms matching your search</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms(availableRooms).map(room => (
                  <RoomCard
                    key={room.id}
                    {...room}
                    onNavigate={handleNavigate}
                    onBook={handleBook}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Busy Rooms */}
          <TabsContent value="busy" className="space-y-6">
            {filteredRooms(busyRooms).length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No rooms in use matching your search</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredRooms(busyRooms).map(room => (
                  <RoomCard
                    key={room.id}
                    {...room}
                    onNavigate={handleNavigate}
                    onBook={handleBook}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Booking Modal */}
        <BookingModal
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          room={selectedRoom}
          onConfirm={() => {
            setBookingOpen(false)
            setSelectedRoom(null)
          }}
        />
      </div>
    </DashboardLayout>
  )
}
