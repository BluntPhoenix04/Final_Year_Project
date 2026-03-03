'use client'

import { Users, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react'

interface Room {
  id: string
  name: string
  type: string
  capacity: number
  isAvailable: boolean
}

interface RoomInfoPanelProps {
  room: Room
}

export default function RoomInfoPanel({ room }: RoomInfoPanelProps) {
  return (
    <div className="bg-card-bg rounded-xl shadow-card p-6 h-96 flex flex-col">
      {/* Room Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-foreground">{room.name}</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              room.isAvailable
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {room.isAvailable ? 'Available' : 'In Use'}
          </span>
        </div>
        <p className="text-sm text-text-secondary">{room.type}</p>
      </div>

      {/* Room Details */}
      <div className="space-y-4 flex-1">
        {/* Capacity */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Users size={20} className="text-primary" />
          <div>
            <p className="text-xs text-text-secondary">Capacity</p>
            <p className="font-semibold text-foreground">{room.capacity} persons</p>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <MapPin size={20} className="text-primary" />
          <div>
            <p className="text-xs text-text-secondary">Room ID</p>
            <p className="font-semibold text-foreground">{room.id}</p>
          </div>
        </div>

        {/* Availability */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          {room.isAvailable ? (
            <>
              <CheckCircle size={20} className="text-green-600" />
              <div>
                <p className="text-xs text-text-secondary">Status</p>
                <p className="font-semibold text-green-600">Ready to use</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle size={20} className="text-red-600" />
              <div>
                <p className="text-xs text-text-secondary">Status</p>
                <p className="font-semibold text-red-600">Currently occupied</p>
              </div>
            </>
          )}
        </div>

        {/* Time Slot */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Clock size={20} className="text-primary" />
          <div>
            <p className="text-xs text-text-secondary">Next Available</p>
            <p className="font-semibold text-foreground">3:00 PM</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-4 border-t border-border">
        <button className="w-full py-2 px-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors">
          Start Navigation
        </button>
        <button className="w-full py-2 px-4 bg-gray-100 text-foreground rounded-lg font-semibold hover:bg-gray-200 transition-colors">
          View Details
        </button>
      </div>
    </div>
  )
}
