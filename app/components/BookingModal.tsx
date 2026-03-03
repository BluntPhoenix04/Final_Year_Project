'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
}

const rooms = ['A101', 'A102', 'A103', 'B201', 'B202', 'C301', 'C305', 'D401', 'D402']

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
]

export default function BookingModal({ isOpen, onClose }: BookingModalProps) {
  const [selectedRoom, setSelectedRoom] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [duration, setDuration] = useState('1')

  const handleConfirm = () => {
    if (selectedRoom && selectedDate && selectedTime) {
      alert(
        `Booking confirmed!\nRoom: ${selectedRoom}\nDate: ${selectedDate}\nTime: ${selectedTime}\nDuration: ${duration} hour(s)`
      )
      onClose()
      // Reset form
      setSelectedRoom('')
      setSelectedDate('')
      setSelectedTime('')
      setDuration('1')
    } else {
      alert('Please fill in all fields')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-card-bg rounded-xl shadow-lg max-w-md w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card-bg">
          <h2 className="text-xl font-bold text-foreground">Book Empty Classroom</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Room Selector */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Select Room
            </label>
            <select
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Choose a room...</option>
              {rooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Time Slot */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Select Time Slot
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Choose a time...</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Duration (hours)
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="1">1 hour</option>
              <option value="2">2 hours</option>
              <option value="3">3 hours</option>
              <option value="4">4 hours</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-6 border-t border-border sticky bottom-0 bg-card-bg">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  )
}
