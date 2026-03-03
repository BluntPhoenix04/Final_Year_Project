'use client'

import { useState, useEffect } from 'react'

interface Room {
  id: string
  name: string
  type: string
  capacity: number
  isAvailable: boolean
}

interface MapProps {
  floor: number
  rooms: Room[]
  onRoomSelect: (room: Room) => void
  selectedRoom: string | null
}

export default function Map({ floor, rooms, onRoomSelect, selectedRoom }: MapProps) {
  const [svgContent, setSvgContent] = useState<string>('')

  useEffect(() => {
    // Generate blueprint-style map with rooms
    const roomWidth = 80
    const roomHeight = 50
    const padding = 40
    const gapX = 20
    const gapY = 40

    const cols = Math.ceil(Math.sqrt(rooms.length))
    const rows = Math.ceil(rooms.length / cols)

    const svgWidth = padding * 2 + cols * (roomWidth + gapX)
    const svgHeight = padding * 2 + rows * (roomHeight + gapY) + 40

    let svg = `<svg width="100%" height="100%" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <style>
          .blueprint-bg { fill: #ecf0f1; }
          .room-rect { stroke: #34495e; stroke-width: 2; }
          .room-label { font-family: Arial; font-size: 12px; font-weight: bold; }
          .room-type { font-family: Arial; font-size: 10px; fill: #7f8c8d; }
        </style>
      </defs>
      <rect width="100%" height="100%" class="blueprint-bg"/>
      <text x="${svgWidth / 2}" y="25" text-anchor="middle" class="room-label" font-size="18">Floor ${floor} Blueprint</text>`

    rooms.forEach((room, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      const x = padding + col * (roomWidth + gapX)
      const y = padding + 40 + row * (roomHeight + gapY)

      const isSelected = room.id === selectedRoom
      const roomColor = isSelected
        ? '#3498db'
        : room.isAvailable
          ? '#2ecc71'
          : '#e74c3c'

      svg += `
        <g class="room-group" style="cursor: pointer;">
          <rect 
            x="${x}" 
            y="${y}" 
            width="${roomWidth}" 
            height="${roomHeight}" 
            class="room-rect" 
            fill="${roomColor}" 
            opacity="${isSelected ? '0.9' : '0.6'}"
            onclick="window.__selectRoom('${room.id}')"
            style="transition: all 0.2s ease; hover: opacity 0.9;"
          />
          <text 
            x="${x + roomWidth / 2}" 
            y="${y + 20}" 
            text-anchor="middle" 
            class="room-label"
            fill="white"
            onclick="window.__selectRoom('${room.id}')"
            style="cursor: pointer;"
          >${room.id}</text>
          <text 
            x="${x + roomWidth / 2}" 
            y="${y + 35}" 
            text-anchor="middle" 
            class="room-type"
            fill="white"
            onclick="window.__selectRoom('${room.id}')"
            style="cursor: pointer;"
          >${room.type}</text>
        </g>`
    })

    svg += '</svg>'
    setSvgContent(svg)

    // Store room select handler
    if (typeof window !== 'undefined') {
      ;(window as any).__selectRoom = (roomId: string) => {
        const room = rooms.find((r) => r.id === roomId)
        if (room) {
          onRoomSelect(room)
        }
      }
    }
  }, [floor, rooms, onRoomSelect, selectedRoom])

  return (
    <div className="w-full h-full overflow-auto bg-gray-50 rounded-lg">
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  )
}
