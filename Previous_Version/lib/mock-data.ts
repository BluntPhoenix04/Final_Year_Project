import { getAllRooms, RoomDef } from './floor-data'

export const buildings = [
  { id: 'main', name: 'Main Campus', floors: 4 },
]

/**
 * Derive bookable rooms from the floor-data blueprint.
 * Exclude lobbies and utility rooms – only rooms, offices, and labs are bookable.
 * Compute a realistic capacity from grid dimensions.
 */
const BOOKABLE_TYPES: RoomDef['type'][] = ['room', 'office', 'lab']

export const rooms = getAllRooms()
  .filter(r => BOOKABLE_TYPES.includes(r.type))
  .map(r => ({
    id: r.id,
    name: r.label,
    building: 'Main Campus',
    floor: r.floor,
    capacity: r.type === 'lab' ? Math.max(15, r.gridW * r.gridH) : Math.max(10, r.gridW * r.gridH * 2),
    occupancy: 0,
    availability: 'available' as const,
    coordinates: [0, 0],
  }))

/**
 * Fall-back timetable used on the Dashboard "My Classes" tab when the user
 * has no personal timetable stored from the login payload.
 * Room IDs reference actual blueprint room IDs so navigation works.
 */
export const timetable = [
  {
    id: 'class-1',
    code: 'CS101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. Alan Smith',
    room: '101',
    building: 'Main Campus',
    floor: 1,
    startTime: '09:00',
    endTime: '10:30',
    day: 'Monday',
    enrolled: true,
  },
  {
    id: 'class-2',
    code: 'MATH201',
    name: 'Calculus II',
    instructor: 'Prof. Sarah Johnson',
    room: '204',
    building: 'Main Campus',
    floor: 2,
    startTime: '11:00',
    endTime: '12:30',
    day: 'Monday',
    enrolled: true,
  },
  {
    id: 'class-3',
    code: 'ENG102',
    name: 'Seminar: Literature & Composition',
    instructor: 'Dr. Emily Williams',
    room: '309',
    building: 'Main Campus',
    floor: 3,
    startTime: '14:00',
    endTime: '15:30',
    day: 'Tuesday',
    enrolled: true,
  },
  {
    id: 'class-4',
    code: 'PHYS301',
    name: 'Modern Physics Lab',
    instructor: 'Prof. Sarah Johnson',
    room: '301',
    building: 'Main Campus',
    floor: 3,
    startTime: '13:00',
    endTime: '14:30',
    day: 'Wednesday',
    enrolled: true,
  },
  {
    id: 'class-5',
    code: 'CS405',
    name: 'Advanced AI Research',
    instructor: 'Dr. Alan Smith',
    room: '409',
    building: 'Main Campus',
    floor: 4,
    startTime: '10:00',
    endTime: '12:00',
    day: 'Thursday',
    enrolled: true,
  },
]

export const facilities = [
  {
    id: 'cafeteria',
    name: 'Main Cafeteria',
    building: 'Main Campus',
    floor: 1,
    type: 'dining',
    hours: '7:00 AM - 10:00 PM',
    coordinates: [25.6, 55.58],
  },
  {
    id: 'gym',
    name: 'Sports Complex',
    building: 'Main Campus',
    floor: 2,
    type: 'fitness',
    hours: '6:00 AM - 11:00 PM',
    coordinates: [25.58, 55.62],
  },
  {
    id: 'health',
    name: 'Health Center',
    building: 'Main Campus',
    floor: 1,
    type: 'medical',
    hours: '8:00 AM - 6:00 PM',
    coordinates: [25.1, 55.18],
  },
  {
    id: 'bookstore',
    name: 'Campus Bookstore',
    building: 'Main Campus',
    floor: 1,
    type: 'retail',
    hours: '9:00 AM - 8:00 PM',
    coordinates: [25.62, 55.6],
  },
]

export const helpDeskCategories = [
  { id: 'navigation', label: 'Navigation Help', icon: 'MapPin' },
  { id: 'booking', label: 'Room Booking', icon: 'Clock' },
  { id: 'facilities', label: 'Facilities', icon: 'Building2' },
  { id: 'technical', label: 'Technical Support', icon: 'Cpu' },
  { id: 'academic', label: 'Academic Info', icon: 'BookOpen' },
  { id: 'other', label: 'Other', icon: 'HelpCircle' },
]
