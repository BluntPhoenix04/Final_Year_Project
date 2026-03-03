'use client'

import DashboardLayout from '../components/DashboardLayout'
import { BarChart3, Users, Building2, AlertCircle } from 'lucide-react'

// Dummy stats
const stats = [
  {
    label: 'Total Students',
    value: '1,245',
    icon: Users,
    color: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  {
    label: 'Total Classrooms',
    value: '48',
    icon: Building2,
    color: 'bg-green-100',
    textColor: 'text-green-600',
  },
  {
    label: 'Bookings Today',
    value: '23',
    icon: BarChart3,
    color: 'bg-purple-100',
    textColor: 'text-purple-600',
  },
  {
    label: 'Alerts',
    value: '5',
    icon: AlertCircle,
    color: 'bg-red-100',
    textColor: 'text-red-600',
  },
]

// Dummy recent activities
const recentActivities = [
  {
    id: 1,
    type: 'booking',
    message: 'Dr. Smith booked Lecture Hall A101 for tomorrow',
    timestamp: '2 hours ago',
    severity: 'info',
  },
  {
    id: 2,
    type: 'student_login',
    message: '45 new students registered today',
    timestamp: '4 hours ago',
    severity: 'success',
  },
  {
    id: 3,
    type: 'alert',
    message: 'Lab B305 needs maintenance',
    timestamp: '1 day ago',
    severity: 'warning',
  },
  {
    id: 4,
    type: 'booking',
    message: 'Seminar Hall B202 booking cancelled',
    timestamp: '2 days ago',
    severity: 'info',
  },
]

// Dummy floor usage
const floorUsage = [
  { floor: 'Floor 1', usage: '85%' },
  { floor: 'Floor 2', usage: '72%' },
  { floor: 'Floor 3', usage: '68%' },
  { floor: 'Floor 4', usage: '45%' },
]

export default function AdminDashboard() {
  return (
    <DashboardLayout requiredRole="admin">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-text-secondary mt-1">
            Manage campus resources and monitor activities
          </p>
        </div>

        {/* Stats Grid */}
        <div id="dashboard" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-card-bg rounded-xl shadow-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className={`${stat.textColor}`} size={24} />
                  </div>
                </div>
                <p className="text-text-secondary text-sm font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-card-bg rounded-xl shadow-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Recent Activities</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentActivities.map((activity) => {
                const severityColors = {
                  info: 'border-blue-200 bg-blue-50',
                  success: 'border-green-200 bg-green-50',
                  warning: 'border-yellow-200 bg-yellow-50',
                  error: 'border-red-200 bg-red-50',
                }
                const textColors = {
                  info: 'text-blue-700',
                  success: 'text-green-700',
                  warning: 'text-yellow-700',
                  error: 'text-red-700',
                }

                return (
                  <div
                    key={activity.id}
                    className={`p-4 border rounded-lg ${severityColors[activity.severity]}`}
                  >
                    <div className="flex items-start justify-between">
                      <p className={`font-medium ${textColors[activity.severity]}`}>
                        {activity.message}
                      </p>
                      <span className="text-xs text-text-secondary whitespace-nowrap ml-4">
                        {activity.timestamp}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Floor Usage */}
          <div className="bg-card-bg rounded-xl shadow-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Floor Usage</h2>
            <div className="space-y-4">
              {floorUsage.map((item) => (
                <div key={item.floor}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">{item.floor}</p>
                    <p className="text-sm font-bold text-primary">{item.usage}</p>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: item.usage }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Room Management */}
        <section className="bg-card-bg rounded-xl shadow-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Room Management</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Room ID
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Capacity
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: 'A101', type: 'Lecture Hall', capacity: 150, status: 'active' },
                  { id: 'A102', type: 'Classroom', capacity: 45, status: 'active' },
                  { id: 'B305', type: 'Lab', capacity: 30, status: 'maintenance' },
                  { id: 'C301', type: 'Computer Lab', capacity: 35, status: 'active' },
                  { id: 'D402', type: 'Lecture Hall', capacity: 200, status: 'active' },
                ].map((room) => (
                  <tr
                    key={room.id}
                    className="border-b border-border hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 font-semibold text-foreground">{room.id}</td>
                    <td className="py-3 px-4 text-text-secondary">{room.type}</td>
                    <td className="py-3 px-4 text-text-secondary">{room.capacity}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                          room.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {room.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-primary hover:text-primary-dark font-semibold text-sm">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
