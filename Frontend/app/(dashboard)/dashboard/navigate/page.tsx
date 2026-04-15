'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import {
  MapPin, Navigation, RotateCcw, Play, ChevronDown,
  Layers, Search, Zap, Target, ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

import {
  CELL_SIZE, GRID_COLS, GRID_ROWS,
  FLOORS, getFloor, getAllRooms, findRoomById, getFloorFromRoomId,
  type RoomDef, type FloorLayout,
} from '@/lib/floor-data'

import {
  dijkstra, astar, bfs, dfs, reconstructPath,
  type GridNode,
} from '@/lib/algorithms'

/* ================= TYPES ========================================= */

type AlgorithmKey = 'astar' | 'dijkstra' | 'bfs' | 'dfs'

const ALGORITHMS: { key: AlgorithmKey; label: string; description: string }[] = [
  { key: 'astar',    label: 'A* Search',    description: 'Heuristic-based optimal path' },
  { key: 'dijkstra', label: "Dijkstra's",   description: 'Uniform cost shortest path' },
  { key: 'bfs',      label: 'BFS',          description: 'Breadth-first unweighted' },
  { key: 'dfs',      label: 'DFS',          description: 'Depth-first exploration' },
]

const SPEED_OPTIONS = [
  { label: 'Slow',   ms: 50 },
  { label: 'Medium', ms: 20 },
  { label: 'Fast',   ms: 5 },
  { label: 'Instant', ms: 0 },
]

/* ================= COLORS ======================================== */

const COLORS = {
  background: '#ffffff',    // matches card background
  corridor:   '#f8fafc',    // very light grey for walkable areas
  wall:       '#e2e8f0',    // solid walls (slate-200)
  gridLine:   '#f1f5f9',    // subtle grid lines (slate-100)
  visited:    'rgba(167, 139, 250, 0.3)', // soft purple visited
  path:       '#8b5cf6',    // primary vibrant purple path
  source:     '#10b981',    // emerald-500
  target:     '#ef4444',    // red-500
  roomHover:  'rgba(139, 92, 246, 0.15)', // light primary hover
  roomBorder: '#cbd5e1',    // slate-300
  text:       '#334155',    // slate-700
}

/* ================= GRID BUILDER ================================== */

function build3DGrid(floors: FloorLayout[]): GridNode[][][] {
  const grid3D: GridNode[][][] = []
  
  for (let z = 0; z < floors.length; z++) {
    const floor = floors[z]
    const grid: GridNode[][] = []
    
    // Create grid defaulting everything as wall
    for (let row = 0; row < GRID_ROWS; row++) {
      const rowArr: GridNode[] = []
      for (let col = 0; col < GRID_COLS; col++) {
        rowArr.push({
          z,
          row,
          col,
          isWall: true,
          isStair: false,
          distance: Infinity,
          heuristic: 0,
          totalDistance: Infinity,
          previousNode: null,
          isVisited: false,
        })
      }
      grid.push(rowArr)
    }

    // Carve out corridors (walkable)
    for (const c of floor.corridors) {
      for (let r = c.y; r < c.y + c.h && r < GRID_ROWS; r++) {
        for (let col = c.x; col < c.x + c.w && col < GRID_COLS; col++) {
          grid[r][col].isWall = false
        }
      }
    }

    // Carve stairs (walkable and vertical traversal)
    for (const s of floor.stairs) {
      for (let r = s.y; r < s.y + s.h && r < GRID_ROWS; r++) {
        for (let col = s.x; col < s.x + s.w && col < GRID_COLS; col++) {
          grid[r][col].isWall = false
          grid[r][col].isStair = true
        }
      }
    }

    // Carve doorways for each room
    for (const room of floor.rooms) {
      if (room.type === 'lobby') {
        for (let r = room.gridY; r < room.gridY + room.gridH && r < GRID_ROWS; r++) {
          for (let col = room.gridX; col < room.gridX + room.gridW && col < GRID_COLS; col++) {
            grid[r][col].isWall = false
          }
        }
        continue
      }

      // Doorway at bottom edge center
      const doorCol = Math.floor(room.gridX + room.gridW / 2)
      const doorRowBottom = room.gridY + room.gridH
      if (doorRowBottom < GRID_ROWS) {
        grid[doorRowBottom][doorCol].isWall = false
        if (doorRowBottom - 1 >= 0) grid[doorRowBottom - 1][doorCol].isWall = false
      }

      // Doorway at top edge center
      const doorRowTop = room.gridY - 1
      if (doorRowTop >= 0) {
        grid[doorRowTop][doorCol].isWall = false
        grid[room.gridY][doorCol].isWall = false
      }
    }
    
    grid3D.push(grid)
  }

  return grid3D
}

function reset3DGrid(grid3D: GridNode[][][]): GridNode[][][] {
  return grid3D.map(floor => 
    floor.map(row =>
      row.map(node => ({
        ...node,
        distance: Infinity,
        heuristic: 0,
        totalDistance: Infinity,
        previousNode: null,
        isVisited: false,
      }))
    )
  )
}

function getRoomNode(room: RoomDef, grid3D: GridNode[][][]): GridNode {
  const z = room.floor - 1
  if (room.type === 'lobby') {
    return grid3D[z][room.gridY + Math.floor(room.gridH / 2)][room.gridX + Math.floor(room.gridW / 2)]
  }
  const doorCol = Math.floor(room.gridX + room.gridW / 2)
  const isBottomRoom = room.gridY >= Math.floor(GRID_ROWS / 2)
  const doorRow = isBottomRoom ? room.gridY - 1 : room.gridY + room.gridH
  const clampedRow = Math.max(0, Math.min(doorRow, GRID_ROWS - 1))
  return grid3D[z][clampedRow][doorCol]
}

/* ================= COMPONENT ===================================== */

export default function NavigatePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  /* ---- State ---- */
  const [currentFloor, setCurrentFloor] = useState(1)
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmKey>('astar')
  const [speedIndex, setSpeedIndex] = useState(1) // Medium

  const [searchInput, setSearchInput] = useState('')
  const [searchResults, setSearchResults] = useState<RoomDef[]>([])
  const [selectedRoom, setSelectedRoom] = useState<RoomDef | null>(null)

  const [sourceSearchInput, setSourceSearchInput] = useState('')
  const [sourceSearchResults, setSourceSearchResults] = useState<RoomDef[]>([])
  const [sourceRoom, setSourceRoom] = useState<RoomDef | null>(null)

  const [hoveredRoom, setHoveredRoom] = useState<RoomDef | null>(null)

  const [isVisualizing, setIsVisualizing] = useState(false)
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set())
  const [pathCells, setPathCells] = useState<{ z: number; row: number; col: number }[]>([])
  const [showAlgoDropdown, setShowAlgoDropdown] = useState(false)

  const floorData = getFloor(currentFloor)

  /* ---- Canvas dimensions ---- */
  const canvasWidth = GRID_COLS * CELL_SIZE
  const canvasHeight = GRID_ROWS * CELL_SIZE

  /* ---- URL Params Auto-Select ---- */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const roomId = params.get('roomId')
      if (roomId) {
        const room = findRoomById(roomId)
        if (room) {
          setSelectedRoom(room)
          setSearchInput('')       // clear input so the green badge shows
          setCurrentFloor(room.floor)
        }
      }
    }
  }, [])

  /* ---- Search: strict match ---- */
  useEffect(() => {
    if (searchInput.trim().length === 0) {
      setSearchResults([])
      return
    }
    const query = searchInput.toLowerCase().trim()
    const allRooms = getAllRooms()
    const matches = allRooms.filter(room =>
      room.id.toLowerCase() === query ||
      room.label.toLowerCase().includes(query)
    )
    setSearchResults(matches)
  }, [searchInput])

  /* ---- Source Search ---- */
  useEffect(() => {
    if (sourceSearchInput.trim().length === 0) {
      setSourceSearchResults([])
      return
    }
    const query = sourceSearchInput.toLowerCase().trim()
    const allRooms = getAllRooms()
    const matches = allRooms.filter(room =>
      room.id.toLowerCase() === query ||
      room.label.toLowerCase().includes(query)
    )
    setSourceSearchResults(matches)
  }, [sourceSearchInput])

  /* ---- Room click handler from search results ---- */
  const handleSelectRoom = useCallback((room: RoomDef) => {
    // Switch floor if needed
    const roomFloor = room.floor
    if (roomFloor !== currentFloor) {
      setCurrentFloor(roomFloor)
    }
    setSelectedRoom(room)
    setSearchInput('')
    setSearchResults([])
    // Reset visualization
    setVisitedCells(new Set())
    setPathCells([])
  }, [currentFloor])

  /* ---- Canvas click → room detection ---- */
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || isVisualizing) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    const col = Math.floor(x / CELL_SIZE)
    const row = Math.floor(y / CELL_SIZE)

    // Check if click lands on any room
    for (const room of floorData.rooms) {
      if (
        col >= room.gridX && col < room.gridX + room.gridW &&
        row >= room.gridY && row < room.gridY + room.gridH
      ) {
        setSelectedRoom(room)
        setVisitedCells(new Set())
        setPathCells([])
        return
      }
    }
  }, [floorData, isVisualizing])

  /* ---- Canvas hover → room tooltip ---- */
  const handleCanvasMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    const col = Math.floor(x / CELL_SIZE)
    const row = Math.floor(y / CELL_SIZE)

    let found: RoomDef | null = null
    for (const room of floorData.rooms) {
      if (
        col >= room.gridX && col < room.gridX + room.gridW &&
        row >= room.gridY && row < room.gridY + room.gridH
      ) {
        found = room
        break
      }
    }
    setHoveredRoom(found)
  }, [floorData])

  /* ---- Run pathfinding ---- */
  const runVisualization = useCallback(() => {
    if (!selectedRoom || isVisualizing) return

    setIsVisualizing(true)
    setVisitedCells(new Set())
    setPathCells([])

    const grid3D = build3DGrid(FLOORS)

    // Calculate start node
    let startNode
    if (sourceRoom) {
      startNode = getRoomNode(sourceRoom, grid3D)
    } else {
      const src = floorData.defaultSource
      startNode = grid3D[currentFloor - 1][src.row][src.col]
    }

    // Calculate end node
    const endNode = getRoomNode(selectedRoom, grid3D)

    if (!startNode || !endNode) {
      setIsVisualizing(false)
      return
    }

    // Ensure start and end are walkable
    startNode.isWall = false
    endNode.isWall = false

    // Run algorithm
    const algoFn = { astar, dijkstra, bfs, dfs }[selectedAlgo]
    const visited = algoFn(grid3D, startNode, endNode)
    const path = reconstructPath(endNode)

    const speed = SPEED_OPTIONS[speedIndex].ms

    if (speed === 0) {
      // Instant
      const vSet = new Set(visited.map(n => `${n.z}-${n.row}-${n.col}`))
      setVisitedCells(vSet)
      setPathCells(path.map(n => ({ z: n.z, row: n.row, col: n.col })))
      setIsVisualizing(false)
      return
    }

    // Animated
    let i = 0
    const vSet = new Set<string>()

    const animateVisited = () => {
      if (i < visited.length) {
        const batch = Math.max(1, Math.floor(3 / (speed / 10)))
        for (let b = 0; b < batch && i < visited.length; b++, i++) {
          vSet.add(`${visited[i].z}-${visited[i].row}-${visited[i].col}`)
        }
        setVisitedCells(new Set(vSet))
        animationRef.current = window.setTimeout(animateVisited, speed) as unknown as number
      } else {
        // Animate path
        let p = 0
        const animatePath = () => {
          if (p < path.length) {
            const node = path[p]
            setPathCells(prev => [...prev, { z: node.z, row: node.row, col: node.col }])
            p++
            animationRef.current = window.setTimeout(animatePath, speed * 2) as unknown as number
          } else {
            setIsVisualizing(false)
          }
        }
        animatePath()
      }
    }
    animateVisited()
  }, [selectedRoom, sourceRoom, floorData, currentFloor, selectedAlgo, speedIndex, isVisualizing])

  /* ---- Reset ---- */
  const handleReset = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current)
    }
    setSelectedRoom(null)
    setSourceRoom(null)
    setVisitedCells(new Set())
    setPathCells([])
    setIsVisualizing(false)
    setSearchInput('')
    setSourceSearchInput('')
    setSearchResults([])
    setSourceSearchResults([])
  }, [])

  /* ---- Render canvas ---- */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Background
    ctx.fillStyle = COLORS.background
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    // Draw corridors
    for (const c of floorData.corridors) {
      ctx.fillStyle = COLORS.corridor
      ctx.fillRect(c.x * CELL_SIZE, c.y * CELL_SIZE, c.w * CELL_SIZE, c.h * CELL_SIZE)
    }

    // Draw grid lines on corridors
    ctx.strokeStyle = COLORS.gridLine
    ctx.lineWidth = 0.3
    for (const c of floorData.corridors) {
      for (let r = c.y; r <= c.y + c.h; r++) {
        ctx.beginPath()
        ctx.moveTo(c.x * CELL_SIZE, r * CELL_SIZE)
        ctx.lineTo((c.x + c.w) * CELL_SIZE, r * CELL_SIZE)
        ctx.stroke()
      }
      for (let col = c.x; col <= c.x + c.w; col++) {
        ctx.beginPath()
        ctx.moveTo(col * CELL_SIZE, c.y * CELL_SIZE)
        ctx.lineTo(col * CELL_SIZE, (c.y + c.h) * CELL_SIZE)
        ctx.stroke()
      }
    }

    // Draw staircases (prominent, with hatching pattern)
    for (const s of floorData.stairs) {
      const sx = s.x * CELL_SIZE
      const sy = s.y * CELL_SIZE
      const sw = s.w * CELL_SIZE
      const sh = s.h * CELL_SIZE

      // Base fill
      ctx.fillStyle = 'rgba(251, 191, 36, 0.25)'  // amber-400 at 25%
      ctx.fillRect(sx, sy, sw, sh)

      // Diagonal stripe fill using clipping
      ctx.save()
      ctx.beginPath()
      ctx.rect(sx, sy, sw, sh)
      ctx.clip()
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.55)'
      ctx.lineWidth = 1.5
      const step = 6
      for (let d = -sh; d < sw + sh; d += step) {
        ctx.beginPath()
        ctx.moveTo(sx + d, sy)
        ctx.lineTo(sx + d + sh, sy + sh)
        ctx.stroke()
      }
      ctx.restore()

      // Border
      ctx.strokeStyle = '#f59e0b'  // amber-500
      ctx.lineWidth = 1.5
      ctx.strokeRect(sx, sy, sw, sh)

      // Label
      ctx.fillStyle = '#92400e'  // amber-900
      ctx.font = 'bold 8px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('↕', sx + sw / 2, sy + sh / 2 - 6)
      ctx.font = '7px Inter, sans-serif'
      ctx.fillText(s.label, sx + sw / 2, sy + sh / 2 + 6)
    }


    // Draw rooms
    for (const room of floorData.rooms) {
      const isSelected = selectedRoom?.id === room.id
      const isHovered = hoveredRoom?.id === room.id

      // Room fill
      if (isSelected) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.2)' // red tint
      } else if (isHovered) {
        ctx.fillStyle = COLORS.roomHover
      } else {
        ctx.fillStyle = room.color
        ctx.globalAlpha = 0.25
      }
      ctx.fillRect(room.gridX * CELL_SIZE, room.gridY * CELL_SIZE, room.gridW * CELL_SIZE, room.gridH * CELL_SIZE)
      ctx.globalAlpha = 1

      // Room border
      ctx.strokeStyle = isSelected ? COLORS.target : COLORS.roomBorder
      ctx.lineWidth = isSelected ? 2.5 : 1
      ctx.strokeRect(room.gridX * CELL_SIZE, room.gridY * CELL_SIZE, room.gridW * CELL_SIZE, room.gridH * CELL_SIZE)

      // Room label
      ctx.fillStyle = isSelected ? '#fca5a5' : COLORS.text
      ctx.font = `${isSelected ? 'bold ' : ''}10px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const cx = (room.gridX + room.gridW / 2) * CELL_SIZE
      const cy = (room.gridY + room.gridH / 2) * CELL_SIZE

      ctx.fillText(room.label, cx, cy - 5)
      ctx.font = '8px Inter, sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText(`#${room.id}`, cx, cy + 7)
    }

    // Draw visited cells ON TOP of rooms
    for (const key of visitedCells) {
      const [z, r, c] = key.split('-').map(Number)
      if (z + 1 !== currentFloor) continue
      ctx.fillStyle = COLORS.visited
      ctx.fillRect(c * CELL_SIZE + 1, r * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2)
    }

    // Draw path cells ON TOP of rooms
    for (const cell of pathCells) {
      if (cell.z + 1 !== currentFloor) continue
      ctx.fillStyle = COLORS.path
      ctx.fillRect(cell.col * CELL_SIZE + 2, cell.row * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4)
      // Bright center dot for clarity
      ctx.fillStyle = '#fff'
      ctx.fillRect(cell.col * CELL_SIZE + CELL_SIZE / 2 - 2, cell.row * CELL_SIZE + CELL_SIZE / 2 - 2, 4, 4)
    }

    // Draw source node
    let srcZ = currentFloor - 1
    let srcRow = floorData.defaultSource.row
    let srcCol = floorData.defaultSource.col

    if (sourceRoom) {
      srcZ = sourceRoom.floor - 1
      const isBottomRoom = sourceRoom.gridY >= Math.floor(GRID_ROWS / 2)
      srcRow = Math.max(0, Math.min(isBottomRoom ? sourceRoom.gridY - 1 : sourceRoom.gridY + sourceRoom.gridH, GRID_ROWS - 1))
      srcCol = Math.floor(sourceRoom.gridX + sourceRoom.gridW / 2)
    }

    if (srcZ + 1 === currentFloor) {
      const srcX = srcCol * CELL_SIZE + CELL_SIZE / 2
      const srcY = srcRow * CELL_SIZE + CELL_SIZE / 2

      ctx.fillStyle = COLORS.source
      ctx.beginPath()
      ctx.arc(srcX, srcY, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#86efac'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(srcX, srcY, 11, 0, Math.PI * 2)
      ctx.stroke()

      // Source label
      ctx.fillStyle = COLORS.source
      ctx.font = 'bold 9px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('START', srcX, srcY - 16)
    }

    // Draw destination marker on selected room
    if (selectedRoom && selectedRoom.floor === currentFloor) {
      const destCol = Math.floor(selectedRoom.gridX + selectedRoom.gridW / 2)
      const isBottomRoom = selectedRoom.gridY >= Math.floor(GRID_ROWS / 2)
      const destRow = isBottomRoom
        ? selectedRoom.gridY - 1
        : selectedRoom.gridY + selectedRoom.gridH
      const clampedDestRow = Math.max(0, Math.min(destRow, GRID_ROWS - 1))
      const destX = destCol * CELL_SIZE + CELL_SIZE / 2
      const destY = clampedDestRow * CELL_SIZE + CELL_SIZE / 2

      ctx.fillStyle = COLORS.target
      ctx.beginPath()
      ctx.arc(destX, destY, 7, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#fca5a5'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(destX, destY, 11, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = COLORS.target
      ctx.font = 'bold 9px Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('END', destX, destY + 20)
    }

  }, [floorData, sourceRoom, selectedRoom, hoveredRoom, visitedCells, pathCells, canvasWidth, canvasHeight, currentFloor])

  /* ---- Cleanup ---- */
  useEffect(() => {
    return () => {
      if (animationRef.current) clearTimeout(animationRef.current)
    }
  }, [])

  /* ================ RENDER ======================================= */
  return (
    <DashboardLayout>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Navigation className="w-6 h-6 text-primary" />
              Campus Navigator
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Interactive pathfinding with multiple algorithms</p>
          </div>

          {/* Algorithm Stats */}
          {visitedCells.size > 0 && (
            <div className="flex gap-3 text-sm">
              <Badge variant="outline" className="gap-1">
                <Zap className="w-3 h-3" />
                Visited: {visitedCells.size}
              </Badge>
              <Badge variant="outline" className="gap-1 text-amber-400 border-amber-400/30">
                <Target className="w-3 h-3" />
                Path: {pathCells.length}
              </Badge>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* ==================== LEFT SIDEBAR ==================== */}
          <div className="space-y-4">

            {/* Search SOURCE */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  From (Source)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-2">
                <Input
                  placeholder="Type room, e.g. lobby, 101..."
                  value={sourceSearchInput}
                  onChange={(e) => setSourceSearchInput(e.target.value)}
                  className="bg-secondary text-sm"
                />
                {sourceSearchResults.length > 0 && (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {sourceSearchResults.map(room => (
                      <button
                        key={room.id}
                        onClick={() => {
                          setSourceRoom(room)
                          setSourceSearchInput('')
                          setSourceSearchResults([])
                          setVisitedCells(new Set())
                          setPathCells([])
                        }}
                        className={cn(
                          'w-full text-left p-2 rounded-lg border transition-all text-xs',
                          sourceRoom?.id === room.id
                            ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500'
                            : 'border-border hover:border-emerald-500/40 text-foreground'
                        )}
                      >
                        <span className="font-medium">{room.label}</span>
                        <span className="text-muted-foreground ml-2">Floor {room.floor}</span>
                      </button>
                    ))}
                  </div>
                )}
                {sourceRoom && sourceSearchInput === '' && (
                   <div className="text-xs p-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md">
                     Selected: {sourceRoom.label} (Floor {sourceRoom.floor})
                   </div>
                )}
              </CardContent>
            </Card>

            {/* Search TARGET */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Search className="w-4 h-4 text-red-500" />
                  To (Target)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-2">
                <Input
                  placeholder="Type target room, e.g. 402..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="bg-secondary text-sm"
                />
                {searchResults.length > 0 && (
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {searchResults.map(room => (
                      <button
                        key={room.id}
                        onClick={() => handleSelectRoom(room)}
                        className={cn(
                          'w-full text-left p-2 rounded-lg border transition-all text-xs',
                          selectedRoom?.id === room.id
                            ? 'border-red-500 bg-red-500/10 text-red-500'
                            : 'border-border hover:border-red-500/40 text-foreground'
                        )}
                      >
                        <span className="font-medium">{room.label}</span>
                        <span className="text-muted-foreground ml-2">Floor {room.floor}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchInput.trim().length > 0 && searchResults.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">No rooms found. Try an exact room number.</p>
                )}
                {selectedRoom && searchInput === '' && (
                   <div className="text-xs p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-md">
                     Selected: {selectedRoom.label} (Floor {selectedRoom.floor})
                   </div>
                )}
              </CardContent>
            </Card>

            {/* Floor Selector */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  Floor View
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2 space-y-3">
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map(f => (
                    <Button
                      key={f}
                      variant={currentFloor === f ? 'default' : 'outline'}
                      size="sm"
                      className="text-xs relative"
                      onClick={() => setCurrentFloor(f)}
                    >
                      F{f}
                      {pathCells.some(c => c.z + 1 === f) && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </Button>
                  ))}
                </div>
                {pathCells.length > 0 && (() => {
                  const floorsUsed = [...new Set(pathCells.map(c => c.z + 1))].sort((a,b) => a - b)
                  return (
                    <div className="text-xs p-2 bg-amber-500/10 border border-amber-500/20 rounded-md">
                      <p className="font-semibold text-amber-500 mb-1">Multi-floor route:</p>
                      <p className="text-foreground">{floorsUsed.map(f => `F${f}`).join(' → ')}</p>
                      <p className="text-muted-foreground mt-1">Switch floors to see path segments. 🔶 = has path.</p>
                    </div>
                  )
                })()}
                {pathCells.length === 0 && (
                  <p className="text-xs text-muted-foreground">🔶 dot = floor has path segment</p>
                )}
              </CardContent>
            </Card>

            {/* Algorithm Selector */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Algorithm
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full justify-between text-xs"
                    size="sm"
                    onClick={() => setShowAlgoDropdown(!showAlgoDropdown)}
                  >
                    {ALGORITHMS.find(a => a.key === selectedAlgo)?.label}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                  {showAlgoDropdown && (
                    <div className="absolute z-50 mt-1 w-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                      {ALGORITHMS.map(algo => (
                        <button
                          key={algo.key}
                          onClick={() => { setSelectedAlgo(algo.key); setShowAlgoDropdown(false) }}
                          className={cn(
                            'w-full text-left px-3 py-2 text-xs hover:bg-accent transition-colors',
                            selectedAlgo === algo.key && 'bg-accent text-accent-foreground'
                          )}
                        >
                          <p className="font-medium">{algo.label}</p>
                          <p className="text-muted-foreground text-[10px]">{algo.description}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Speed */}
            <Card>
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-sm">Speed</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <div className="grid grid-cols-4 gap-1">
                  {SPEED_OPTIONS.map((s, i) => (
                    <Button
                      key={s.label}
                      variant={speedIndex === i ? 'default' : 'outline'}
                      size="sm"
                      className="text-[10px] px-1"
                      onClick={() => setSpeedIndex(i)}
                    >
                      {s.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Room Detail */}
            {selectedRoom && (
              <Card className="border-primary/30">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-red-400" />
                    Destination
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground text-sm">{selectedRoom.label}</h3>
                    <p className="text-xs text-muted-foreground">Room #{selectedRoom.id} · Floor {selectedRoom.floor}</p>
                    <Badge variant="outline" className="mt-1 text-[10px]">{selectedRoom.type}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 text-xs"
                      onClick={runVisualization}
                      disabled={isVisualizing}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      {isVisualizing ? 'Running...' : 'Visualize'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleReset}
                    >
                      <RotateCcw className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Controls */}
            <Card>
              <CardContent className="p-4">
                <Button
                  variant="outline"
                  className="w-full text-xs"
                  size="sm"
                  onClick={handleReset}
                >
                  <RotateCcw className="w-3 h-3 mr-2" />
                  Reset Everything
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ==================== MAIN CANVAS ===================== */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm">{floorData.label} — Blueprint</CardTitle>
                  <CardDescription className="text-xs">Click a room to set destination, then visualize the path</CardDescription>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.source }} />
                    Start
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS.target }} />
                    End
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5" style={{ background: COLORS.visited }} />
                    Visited
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5" style={{ background: COLORS.path }} />
                    Path
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5" style={{ background: COLORS.stairs }} />
                    Stairs
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2 flex justify-center">
                <canvas
                  ref={canvasRef}
                  className="border border-border rounded-lg cursor-crosshair"
                  style={{
                    width: `${canvasWidth}px`,
                    height: `${canvasHeight}px`,
                    maxWidth: '100%',
                  }}
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMove}
                  onMouseLeave={() => setHoveredRoom(null)}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ==================== BOTTOM INFO ====================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ALGORITHMS.map(algo => (
            <Card key={algo.key} className={cn(
              'transition-all',
              selectedAlgo === algo.key && 'border-primary/50 bg-primary/5'
            )}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold',
                  selectedAlgo === algo.key ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                )}>
                  {algo.key === 'astar' ? 'A*' : algo.key === 'dijkstra' ? 'DJ' : algo.key.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{algo.label}</p>
                  <p className="text-[10px] text-muted-foreground">{algo.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
