'use client'

import { MapPin, Users, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface RoomCardProps {
  id: string
  name: string
  building: string
  floor: number
  capacity: number
  occupancy: number
  availability: 'available' | 'busy' | 'closed'
  nextClass?: string
  onNavigate?: (roomId: string) => void
  onBook?: (roomId: string) => void
}

export function RoomCard({
  id,
  name,
  building,
  floor,
  capacity,
  occupancy,
  availability,
  nextClass,
  onNavigate,
  onBook,
}: RoomCardProps) {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700'
      case 'busy':
        return 'bg-orange-100 text-orange-700'
      case 'closed':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available Now'
      case 'busy':
        return 'In Use'
      case 'closed':
        return 'Closed'
      default:
        return 'Unknown'
    }
  }

  const occupancyPercent = Math.round((occupancy / capacity) * 100)

  return (
    <Card className="hover:shadow-md transition-all hover:border-primary/30">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-foreground">{name}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{building}, Floor {floor}</span>
            </div>
          </div>
          <Badge className={cn('text-xs font-medium', getAvailabilityColor(availability))}>
            {getAvailabilityText(availability)}
          </Badge>
        </div>

        {/* Capacity */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Occupancy</span>
            </div>
            <span className="font-medium">{occupancy}/{capacity}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                occupancyPercent > 80 ? 'bg-orange-500' : occupancyPercent > 50 ? 'bg-blue-500' : 'bg-green-500'
              )}
              style={{ width: `${Math.min(occupancyPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Next Class */}
        {nextClass && (
          <div className="flex items-center gap-2 text-sm bg-secondary/50 rounded p-2">
            <Clock className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-muted-foreground">
              Next: <span className="font-medium text-foreground">{nextClass}</span>
            </span>
          </div>
        )}

        {/* Actions */}
        <div className={`grid gap-2 ${onBook ? 'grid-cols-2' : 'grid-cols-1'}`}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onNavigate?.(id)}
          >
            Navigate
          </Button>
          {onBook && (
            <Button
              size="sm"
              variant={availability === 'available' ? 'default' : 'ghost'}
              onClick={() => onBook(id)}
              disabled={availability !== 'available'}
            >
              Book
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
