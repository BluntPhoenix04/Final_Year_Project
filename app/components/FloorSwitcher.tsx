'use client'

interface FloorSwitcherProps {
  currentFloor: number
  onFloorChange: (floor: number) => void
  maxFloors: number
}

export default function FloorSwitcher({
  currentFloor,
  onFloorChange,
  maxFloors,
}: FloorSwitcherProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: maxFloors }, (_, i) => i + 1).map((floor) => (
        <button
          key={floor}
          onClick={() => onFloorChange(floor)}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            currentFloor === floor
              ? 'bg-primary text-white shadow-lg'
              : 'bg-gray-100 text-foreground hover:bg-gray-200'
          }`}
        >
          Floor {floor}
        </button>
      ))}
    </div>
  )
}
