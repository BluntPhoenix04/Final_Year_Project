'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Clock, Users } from 'lucide-react'
import { rooms } from '@/lib/mock-data'

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  room?: {
    id: string
    name: string
    building: string
    floor: number
    capacity: number
  }
  onConfirm?: (booking: any) => void
}

export function BookingModal({
  open,
  onOpenChange,
  room,
  onConfirm,
}: BookingModalProps) {
  const [selectedRoomId, setSelectedRoomId] = useState(room?.id || '')
  
  useEffect(() => {
    if (open && room) {
      setSelectedRoomId(room.id)
    }
  }, [open, room])

  const availableRooms = rooms.filter(r => r.availability === 'available')
  const currentRoom = availableRooms.find(r => r.id === selectedRoomId) || room

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '10:00',
    attendees: '5',
    purpose: 'Lecture',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      onConfirm?.({
        roomId: currentRoom?.id,
        roomName: currentRoom?.name,
        building: currentRoom?.building,
        floor: currentRoom?.floor,
        ...formData,
        attendees: parseInt(formData.attendees),
      })
      setIsSubmitting(false)
      onOpenChange(false)
    }, 600)
  }

  if (!currentRoom) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Book Classroom / Space</DialogTitle>
          <DialogDescription>
            Reserve {currentRoom.name} for your lecture, session, or meeting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Room Selection */}
          <div className="space-y-2">
            <Label htmlFor="room">Select Room</Label>
            <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} ({r.building}, Floor {r.floor} · Cap: {r.capacity})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date */}
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Time Range */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
            </div>

            {/* Attendees */}
            <div className="space-y-2">
              <Label htmlFor="attendees">Number of Attendees</Label>
              <Select value={formData.attendees} onValueChange={(value) => setFormData({ ...formData, attendees: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: currentRoom.capacity }, (_, i) => (i + 1).toString()).map((num) => (
                    <SelectItem key={num} value={num}>
                      {num} person{num !== '1' ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Select value={formData.purpose} onValueChange={(value) => setFormData({ ...formData, purpose: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lecture">Lecture</SelectItem>
                  <SelectItem value="Lab Session">Lab Session</SelectItem>
                  <SelectItem value="Office Hours">Office Hours</SelectItem>
                  <SelectItem value="Faculty Meeting">Faculty Meeting</SelectItem>
                  <SelectItem value="Seminar">Seminar</SelectItem>
                  <SelectItem value="Exam / Test">Exam / Test</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
