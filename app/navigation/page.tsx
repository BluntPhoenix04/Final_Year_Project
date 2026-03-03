'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import Chatbot from '../components/Chatbot'

export default function NavigationPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  const handleZoom = (factor: number) => {
    setZoom((prev) => Math.max(0.5, Math.min(2, prev + factor)))
  }

  const handleReset = () => {
    setZoom(1)
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-card-bg border-b border-border z-40 flex items-center px-6 gap-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-text-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Back</span>
        </button>
        <h1 className="text-2xl font-bold text-foreground">Live Campus Navigation</h1>
      </header>

      {/* Main Navigation Area */}
      <main className="pt-16 w-full h-screen flex">
        {/* Blueprint Map */}
        <div className="flex-1 bg-gradient-to-br from-blue-50 to-gray-100 relative overflow-hidden">
          <div
            className="w-full h-full flex items-center justify-center transition-transform duration-200"
            style={{ transform: `scale(${zoom})` }}
          >
            <svg
              width="800"
              height="600"
              viewBox="0 0 800 600"
              xmlns="http://www.w3.org/2000/svg"
              className="bg-white shadow-lg"
            >
              {/* Grid background */}
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                  />
                </pattern>
              </defs>
              <rect width="800" height="600" fill="url(#grid)" />

              {/* Corridor */}
              <rect x="150" y="50" width="500" height="500" fill="none" stroke="#34495e" strokeWidth="2" />

              {/* Rooms on Left */}
              <rect x="50" y="80" width="100" height="70" fill="#3498db" opacity="0.3" stroke="#34495e" strokeWidth="2" />
              <text x="100" y="120" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#34495e">
                A101
              </text>

              <rect x="50" y="180" width="100" height="70" fill="#2ecc71" opacity="0.3" stroke="#34495e" strokeWidth="2" />
              <text x="100" y="220" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#34495e">
                A102
              </text>

              <rect x="50" y="280" width="100" height="70" fill="#2ecc71" opacity="0.3" stroke="#34495e" strokeWidth="2" />
              <text x="100" y="320" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#34495e">
                A103
              </text>

              <rect x="50" y="380" width="100" height="70" fill="#e74c3c" opacity="0.3" stroke="#34495e" strokeWidth="2" />
              <text x="100" y="420" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#34495e">
                B201
              </text>

              {/* Rooms on Right */}
              <rect x="650" y="80" width="100" height="70" fill="#2ecc71" opacity="0.3" stroke="#34495e" strokeWidth="2" />
              <text x="700" y="120" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#34495e">
                C301
              </text>

              <rect x="650" y="180" width="100" height="70" fill="#e74c3c" opacity="0.3" stroke="#34495e" strokeWidth="2" />
              <text x="700" y="220" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#34495e">
                C302
              </text>

              <rect x="650" y="280" width="100" height="70" fill="#2ecc71" opacity="0.3" stroke="#34495e" strokeWidth="2" />
              <text x="700" y="320" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#34495e">
                D401
              </text>

              <rect x="650" y="380" width="100" height="70" fill="#2ecc71" opacity="0.3" stroke="#34495e" strokeWidth="2" />
              <text x="700" y="420" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#34495e">
                D402
              </text>

              {/* Navigation Path */}
              <path
                d="M 100 115 L 400 300 L 700 115"
                stroke="#2563eb"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
              />

              {/* Start Marker */}
              <circle cx="100" cy="115" r="8" fill="#2ecc71" stroke="#27ae60" strokeWidth="2" />
              <circle cx="100" cy="115" r="12" fill="none" stroke="#2ecc71" strokeWidth="1" opacity="0.5" />

              {/* End Marker */}
              <circle cx="700" cy="115" r="8" fill="#e74c3c" stroke="#c0392b" strokeWidth="2" />
              <circle cx="700" cy="115" r="12" fill="none" stroke="#e74c3c" strokeWidth="1" opacity="0.5" />

              {/* Current Position */}
              <circle cx="300" cy="250" r="6" fill="#2563eb" stroke="#1e40af" strokeWidth="2" />
              <circle cx="300" cy="250" r="10" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.5" />

              {/* Stairs */}
              <g opacity="0.5">
                <rect x="380" y="280" width="40" height="40" fill="none" stroke="#95a5a6" strokeWidth="2" />
                <line x1="380" y1="280" x2="420" y2="320" stroke="#95a5a6" strokeWidth="1" />
                <line x1="420" y1="280" x2="380" y2="320" stroke="#95a5a6" strokeWidth="1" />
              </g>

              {/* Legends */}
              <text x="20" y="570" fontSize="12" fill="#34495e" fontWeight="bold">
                Legend:
              </text>
              <circle cx="50" cy="560" r="4" fill="#2ecc71" />
              <text x="65" y="565" fontSize="11" fill="#34495e">
                Available
              </text>
              <circle cx="180" cy="560" r="4" fill="#e74c3c" />
              <text x="195" y="565" fontSize="11" fill="#34495e">
                In Use
              </text>
            </svg>
          </div>

          {/* Floating Controls */}
          <div className="fixed right-6 bottom-6 flex flex-col gap-2 bg-card-bg rounded-lg shadow-lg p-2">
            <button
              onClick={() => handleZoom(0.1)}
              className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={() => handleZoom(-0.1)}
              className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={handleReset}
              className="p-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Info Panel */}
        <aside className="w-80 bg-card-bg border-l border-border p-6 overflow-y-auto max-sm:hidden">
          <h2 className="text-xl font-bold text-foreground mb-6">Navigation Details</h2>

          <div className="space-y-6">
            {/* From */}
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase mb-2">
                From
              </p>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-bold text-green-900">Lecture Hall A101</p>
                <p className="text-sm text-green-700 mt-1">Building A, Floor 1</p>
              </div>
            </div>

            {/* To */}
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase mb-2">
                To
              </p>
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-bold text-red-900">Lab C301</p>
                <p className="text-sm text-red-700 mt-1">Building C, Floor 3</p>
              </div>
            </div>

            {/* Distance & Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-text-secondary mb-1">Distance</p>
                <p className="font-bold text-foreground">~250m</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-text-secondary mb-1">Est. Time</p>
                <p className="font-bold text-foreground">~3 min</p>
              </div>
            </div>

            {/* Directions */}
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase mb-3">
                Directions
              </p>
              <ol className="space-y-2 text-sm">
                <li className="flex gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold flex-shrink-0">
                    1
                  </span>
                  <span className="text-foreground">
                    Exit from A101 and head right
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold flex-shrink-0">
                    2
                  </span>
                  <span className="text-foreground">
                    Go straight until you reach the stairs
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold flex-shrink-0">
                    3
                  </span>
                  <span className="text-foreground">
                    Climb to Floor 3
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full text-xs font-bold flex-shrink-0">
                    4
                  </span>
                  <span className="text-foreground">
                    Turn left and find C301
                  </span>
                </li>
              </ol>
            </div>

            {/* Action Button */}
            <button className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors">
              Start Real-Time Navigation
            </button>
          </div>
        </aside>
      </main>
      <Chatbot />
    </div>
  )
}
