'use client'

import DashboardLayout from '../components/DashboardLayout'
import { useState } from 'react'
import { Clock, BookOpen, MapPin } from 'lucide-react'
import Map from '../components/Map'
import RoomInfoPanel from '../components/RoomInfoPanel'
import FloorSwitcher from '../components/FloorSwitcher'
import BookingModal from '../components/BookingModal'

// Dummy timetable data
const teacherTimetable = [
  {
    id: 1,
    subject: 'Data Structures - Lecture 1',
    time: '09:00 - 10:30 AM',
    block: 'Block A',
    room: 'A101',
  },
  {
    id: 2,
    subject: 'Data Structures - Lecture 2',
    time: '10:45 - 12:15 PM',
    block: 'Block A',
    room: 'A103',
  },
  {
    id: 3,
    subject: 'Web Development Workshop',
    time: '02:00 - 04:00 PM',
    block: 'Block C',
    room: 'C301',
  },
]

// Dummy rooms data
const roomsData = {
  1: [
    {
      id: 'A101',
      name: 'Lecture Hall A101',
      type: 'Lecture Hall',
      capacity: 150,
      isAvailable: false,
    },
    {
      id: 'A102',
      name: 'Classroom A102',
      type: 'Classroom',
      capacity: 45,
      isAvailable: true,
    },
    {
      id: 'A103',
      name: 'Lab A103',
      type: 'Lab',
      capacity: 30,
      isAvailable: true,
    },
  ],
  2: [
    {
      id: 'B201',
      name: 'Meeting Room B201',
      type: 'Meeting Room',
      capacity: 20,
      isAvailable: true,
    },
    {
      id: 'B202',
      name: 'Seminar Hall B202',
      type: 'Seminar Hall',
      capacity: 80,
      isAvailable: false,
    },
  ],
  3: [
    {
      id: 'C301',
      name: 'Computer Lab C301',
      type: 'Lab',
      capacity: 35,
      isAvailable: true,
    },
    {
      id: 'C305',
      name: 'Classroom C305',
      type: 'Classroom',
      capacity: 40,
      isAvailable: false,
    },
  ],
  4: [
    {
      id: 'D401',
      name: 'Advanced Lab D401',
      type: 'Lab',
      capacity: 25,
      isAvailable: false,
    },
  ],
}

export default function TeacherDashboard() {
  const [selectedFloor, setSelectedFloor] = useState(1)
  const [selectedRoom, setSelectedRoom] = useState<(typeof roomsData)[1][0] | null>(null)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  return (
    <DashboardLayout requiredRole="teacher">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Manage your classes, bookings, and navigate the campus
          </p>
        </div>

        {/* Teaching Timetable */}
        <section id="timetable" className="bg-card-bg rounded-xl shadow-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Teaching Timetable</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Subject
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Time
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Block
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Room
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {teacherTimetable.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-foreground flex items-center gap-2">
                      <BookOpen size={16} className="text-primary" />
                      {item.subject}
                    </td>
                    <td className="py-3 px-4 text-text-secondary flex items-center gap-2">
                      <Clock size={16} />
                      {item.time}
                    </td>
                    <td className="py-3 px-4 text-text-secondary">{item.block}</td>
                    <td className="py-3 px-4 font-semibold text-primary">{item.room}</td>
                    <td className="py-3 px-4">
                      <button className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-semibold hover:bg-cyan-600 transition-colors">
                        Navigate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Booking Section */}
        <section id="bookings" className="bg-card-bg rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Book Empty Classrooms</h2>
            <button
              onClick={() => setIsBookingModalOpen(true)}
              className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              + New Booking
            </button>
          </div>

          {/* Bookings List */}
          <div className="space-y-3">
            <div className="p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">Lab Session - Computer Lab A103</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Tomorrow, 10:00 AM - 12:00 PM
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                  Confirmed
                </span>
              </div>
            </div>

            <div className="p-4 border border-border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-foreground">Seminar - Meeting Room B201</p>
                  <p className="text-sm text-text-secondary mt-1">
                    Friday, 2:00 PM - 4:00 PM
                  </p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  Pending
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Section */}
        <section id="navigation" className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Campus Navigation</h2>
            <p className="text-text-secondary">
              Find classrooms and navigate the campus
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map Area */}
            <div className="lg:col-span-2 bg-card-bg rounded-xl shadow-card p-6">
              <FloorSwitcher
                currentFloor={selectedFloor}
                onFloorChange={setSelectedFloor}
                maxFloors={4}
              />
              <div className="mt-6 h-96 bg-gray-100 rounded-lg overflow-hidden">
                <Map
                  floor={selectedFloor}
                  rooms={roomsData[selectedFloor as keyof typeof roomsData] || []}
                  onRoomSelect={setSelectedRoom}
                  selectedRoom={selectedRoom?.id || null}
                />
              </div>
            </div>

            {/* Room Info Panel */}
            <div className="lg:col-span-1">
              {selectedRoom ? (
                <RoomInfoPanel room={selectedRoom} />
              ) : (
                <div className="bg-card-bg rounded-xl shadow-card p-6 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-text-secondary">
                      Select a room to view details
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </DashboardLayout>
  )
}
