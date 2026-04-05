'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { rooms, buildings } from '@/lib/mock-data'
import { MapPin, Navigation, Locate, ChevronRight, Users, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ================= PATHFINDING CONSTANTS ================= */

const GRID_SIZE = 50

const buildingZones = [
  {
    id: "library",
    x: 100,
    y: 100,
    w: 150,
    h: 120,
    label: "Library",
    dest: { x: 175, y: 230 },
    color: '#dbeafe'
  },
  {
    id: "science",
    x: 300,
    y: 80,
    w: 140,
    h: 140,
    label: "Science Hall",
    dest: { x: 370, y: 230 },
    color: '#dcfce7'
  },
  {
    id: "tech",
    x: 500,
    y: 120,
    w: 150,
    h: 100,
    label: "Tech Center",
    dest: { x: 575, y: 240 },
    color: '#fce7f3'
  },
  {
    id: "arts",
    x: 150,
    y: 300,
    w: 140,
    h: 130,
    label: "Arts Room",
    dest: { x: 220, y: 450 },
    color: '#fef3c7'
  },
  {
    id: "student",
    x: 400,
    y: 300,
    w: 160,
    h: 110,
    label: "Student Center",
    dest: { x: 480, y: 440 },
    color: '#e0e7ff'
  }
]

/* ================= CREATE WALKABLE GRID ================= */

function createGrid(width: number, height: number) {
  const cols = Math.floor(width / GRID_SIZE)
  const rows = Math.floor(height / GRID_SIZE)

  const grid = Array.from({ length: rows }, () => Array(cols).fill(0))

  buildingZones.forEach((zone) => {
    const startX = Math.floor(zone.x / GRID_SIZE)
    const endX = Math.floor((zone.x + zone.w) / GRID_SIZE)

    const startY = Math.floor(zone.y / GRID_SIZE)
    const endY = Math.floor((zone.y + zone.h) / GRID_SIZE)

    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        if (grid[y] && grid[y][x] !== undefined) {
          grid[y][x] = 1
        }
      }
    }
  })

  return grid
}

/* ================= A* PATHFINDING ================= */

function findPath(grid: number[][], start: any, end: any) {
  const rows = grid.length
  const cols = grid[0].length

  const open: any[] = []
  const closed = new Set()

  open.push({ ...start, g: 0, h: 0, f: 0, parent: null })

  const key = (n: any) => `${n.x}-${n.y}`

  let iterations = 0

  while (open.length) {
    iterations++
    if (iterations > 5000) break

    open.sort((a, b) => a.f - b.f)

    const current = open.shift()

    if (current.x === end.x && current.y === end.y) {
      const path = []
      let node = current

      while (node) {
        path.push(node)
        node = node.parent
      }

      return path.reverse()
    }

    closed.add(key(current))

    const dirs = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ]

    for (const d of dirs) {
      const nx = current.x + d.x
      const ny = current.y + d.y

      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue
      if (grid[ny][nx] === 1) continue

      const k = `${nx}-${ny}`
      if (closed.has(k)) continue

      const g = current.g + 1
      const h = Math.abs(nx - end.x) + Math.abs(ny - end.y)
      const f = g + h

      const existing = open.find(n => n.x === nx && n.y === ny)

      if (existing && existing.g <= g) continue

      open.push({
        x: nx,
        y: ny,
        g,
        h,
        f,
        parent: current
      })
    }
  }

  return []
}

/* ================= POSITION → GRID ================= */

function toGrid(pos: { x: number; y: number }) {
  return {
    x: Math.floor(pos.x / GRID_SIZE),
    y: Math.floor(pos.y / GRID_SIZE),
  }
}

export default function NavigatePage() {
  const searchParams = useSearchParams()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [searchInput, setSearchInput] = useState('')
  const [filteredRooms, setFilteredRooms] = useState(rooms)
  const [userLocation, setUserLocation] = useState({ x: 50, y: 50 })
  const [showPath, setShowPath] = useState(true)

  useEffect(() => {
    const roomParam = searchParams.get('room')
    if (roomParam) {
      const room = rooms.find(r => r.id === roomParam)
      if (room) {
        setSelectedRoom(room)
        setShowPath(true)
      }
    }
  }, [searchParams])

  useEffect(() => {
    const filtered = rooms.filter(room =>
      room.name.toLowerCase().includes(searchInput.toLowerCase()) ||
      room.building.toLowerCase().includes(searchInput.toLowerCase()) ||
      room.id.toLowerCase().includes(searchInput.toLowerCase())
    )
    setFilteredRooms(filtered)
  }, [searchInput])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Fill background
    ctx.fillStyle = '#f5f5f5'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = '#e5e5e5'
    ctx.lineWidth = 1
    for (let i = 0; i <= canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i <= canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Draw building zones

    buildingZones.forEach(zone => {
      ctx.fillStyle = zone.color
      ctx.fillRect(zone.x, zone.y, zone.w, zone.h)
      ctx.strokeStyle = '#999'
      ctx.lineWidth = 2
      ctx.strokeRect(zone.x, zone.y, zone.w, zone.h)

      ctx.fillStyle = '#333'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(zone.label, zone.x + zone.w / 2, zone.y + zone.h / 2 + 5)
    })

    buildingZones.forEach(zone => {
      ctx.fillStyle = "#1d4ed8"
      ctx.beginPath()
      ctx.arc(zone.dest.x, zone.dest.y, 6, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw room markers
    rooms.forEach(room => {
      const x = 100 + Math.sin(room.id.charCodeAt(0) / 100) * 300
      const y = 150 + Math.cos(room.id.charCodeAt(1) / 100) * 200

      const isSelected = selectedRoom?.id === room.id
      const radius = isSelected ? 8 : 6

      ctx.fillStyle = room.availability === 'available' ? '#10b981' : room.availability === 'busy' ? '#f59e0b' : '#ef4444'
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()

      if (isSelected) {
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.arc(x, y, radius + 4, 0, Math.PI * 2)
        ctx.stroke()
      }
    })

    // Draw user location
    ctx.fillStyle = '#3b82f6'
    ctx.beginPath()
    ctx.arc(userLocation.x, userLocation.y, 5, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = '#93c5fd'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(userLocation.x, userLocation.y, 15, 0, Math.PI * 2)
    ctx.stroke()

    // Draw path if room selected
    if (selectedRoom && showPath) {
      const building = buildingZones.find(
        (b) => b.label === selectedRoom.building
      )
      if (!building) return
      const targetX = building.dest.x
      const targetY = building.dest.y

      const grid = createGrid(canvas.width, canvas.height)
      const start = toGrid(userLocation)
      const end = toGrid({
        x: targetX,
        y: targetY
      })
      if (grid[start.y]?.[start.x] === 1) {
        grid[start.y][start.x] = 0
      }
      if (grid[end.y]?.[end.x] === 1) {
        grid[end.y][end.x] = 0
      }
      const path = findPath(grid, start, end)
      console.log("PATH:", path)

      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 3
      ctx.beginPath()

      path.forEach((node: any, i: number) => {
        const px = node.x * GRID_SIZE + GRID_SIZE / 2
        const py = node.y * GRID_SIZE + GRID_SIZE / 2

        if (i === 0) {
          ctx.moveTo(px, py)
        } else {
          ctx.lineTo(px, py)
        }
      })

      ctx.stroke()
    }
  }, [selectedRoom, userLocation, showPath])

  const handleRoomSelect = (room: any) => {
    setSelectedRoom(room)
    setShowPath(true)
  }

  const handleStartNavigation = () => {
    if (selectedRoom) {
      // Simulate navigation with animated movement
      setShowPath(true)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Campus Navigator</h1>
          <p className="text-muted-foreground">Find your way around campus with real-time navigation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Room Search */}
          <div className="space-y-4">
            {/* Search */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  placeholder="Search rooms, buildings..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="bg-secondary"
                />

                <div className="space-y-2">
                  {filteredRooms.slice(0, 8).map(room => (
                    <button
                      key={room.id}
                      onClick={() => handleRoomSelect(room)}
                      className={cn(
                        'w-full text-left p-2 rounded-lg border-2 transition-all text-sm',
                        selectedRoom?.id === room.id
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/30'
                      )}
                    >
                      <p className="font-medium text-foreground truncate">{room.name}</p>
                      <p className="text-xs text-muted-foreground">{room.building}, Floor {room.floor}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Room Info */}
            {selectedRoom && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Room Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{selectedRoom.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedRoom.building}, Floor {selectedRoom.floor}</span>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Availability</span>
                      <Badge className={selectedRoom.availability === 'available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                        {selectedRoom.availability === 'available' ? 'Available' : 'In Use'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Occupancy</span>
                      <span className="font-medium">{selectedRoom.occupancy}/{selectedRoom.capacity}</span>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleStartNavigation}>
                    <Navigation className="w-4 h-4 mr-2" />
                    Start Navigation
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  <Locate className="w-4 h-4 mr-2" />
                  Current Location
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  size="sm"
                  onClick={() => setShowPath(!showPath)}
                >
                  {showPath ? 'Hide' : 'Show'} Path
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right - Map Canvas */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Campus Map</CardTitle>
                <CardDescription>Interactive navigation view</CardDescription>
              </CardHeader>
              <CardContent className="h-full">
                <canvas
                  ref={canvasRef}
                  className="w-full border border-border rounded-lg bg-white"
                  style={{ height: '600px' }}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Map Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-sm text-muted-foreground">In Use</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-muted-foreground">Your Location</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500" style={{ borderRight: '2px dashed' }}></div>
                <span className="text-sm text-muted-foreground">Navigation Path</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
