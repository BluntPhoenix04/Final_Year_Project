/* ================================================================
   Floor Blueprint Data
   
   Based on the university blueprint images provided:
   - An H-shaped building with a central lobby/corridor
   - Left wing (rooms on top and bottom rows)
   - Right wing (rooms on top and bottom rows)
   - Central section connecting them (lobby on Floor 1, corridor on upper)
   - Staircases on both sides of the central section
   
   Grid dimensions: 40 cols x 24 rows (each cell ~20px when rendered)
   Canvas rendering size: 800 x 480 (fits the mini canvas panel)
   ================================================================ */

export const CELL_SIZE = 20
export const GRID_COLS = 40
export const GRID_ROWS = 24

/* ---------- Room definition -------------------------------------- */

export type RoomDef = {
  id: string            // e.g. "101", "202"
  label: string         // display label
  floor: number
  gridX: number         // top-left grid col
  gridY: number         // top-left grid row
  gridW: number         // width in cells
  gridH: number         // height in cells
  color: string
  type: 'room' | 'office' | 'lab' | 'lobby' | 'utility'
}

/* ---------- Floor layout definition ------------------------------ */

export type FloorLayout = {
  floor: number
  label: string
  rooms: RoomDef[]
  /** Walkable corridors represented as rectangles {x,y,w,h} in grid cells */
  corridors: { x: number; y: number; w: number; h: number }[]
  /** Staircases for vertical traversal */
  stairs: { x: number; y: number; w: number; h: number; label: string }[]
  /** Wall cells that block pathfinding (beyond default outer walls) */
  walls: { x: number; y: number; w: number; h: number }[]
  /** Default source node position on this floor */
  defaultSource: { row: number; col: number }
}

/* ---------- Color palette ---------------------------------------- */
const C = {
  room: '#e0e7ff',      // indigo-100
  office: '#dbeafe',    // blue-100
  lab: '#dcfce7',       // green-100
  lobby: '#fef3c7',     // amber-100
  utility: '#f3e8ff',   // purple-100
}

/* ==================================================================
   FLOOR 1 – Main Entrance & Offices
   Based on "First Floor" blueprint:
   - Central Main Entrance Lobby
   - Left wing: Rooms I-VIII (top and bottom rows)
   - Right wing: Rooms IX-XIX + Admin offices
   ================================================================ */

const floor1: FloorLayout = {
  floor: 1,
  label: 'First Floor',
  rooms: [
    // ---- Left Wing Top Row ----
    { id: '101', label: 'Room 101',     floor: 1, gridX: 1,  gridY: 1,  gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '102', label: 'Room 102',     floor: 1, gridX: 5,  gridY: 1,  gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '103', label: 'Room 103',     floor: 1, gridX: 9,  gridY: 1,  gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '104', label: 'Room 104',     floor: 1, gridX: 13, gridY: 1,  gridW: 4, gridH: 4, color: C.room, type: 'room' },

    // ---- Left Wing Bottom Row ----
    { id: '105', label: 'Room 105',     floor: 1, gridX: 1,  gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '106', label: 'Room 106',     floor: 1, gridX: 5,  gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '107', label: 'Room 107',     floor: 1, gridX: 9,  gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '108', label: 'Room 108',     floor: 1, gridX: 13, gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },

    // ---- Central Dean's Office (top) ----
    { id: '109', label: "Dean's Office", floor: 1, gridX: 17, gridY: 1,  gridW: 6, gridH: 5, color: C.office, type: 'office' },

    // ---- Central Lobby ----
    { id: '110', label: 'Main Lobby',   floor: 1, gridX: 17, gridY: 10, gridW: 6, gridH: 7, color: C.lobby, type: 'lobby' },

    // ---- Right Wing Top Row ----
    { id: '111', label: 'Room 111',     floor: 1, gridX: 23, gridY: 1,  gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '112', label: 'Room 112',     floor: 1, gridX: 27, gridY: 1,  gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '113', label: 'Room 113',     floor: 1, gridX: 31, gridY: 1,  gridW: 4, gridH: 4, color: C.room, type: 'room' },

    // ---- Right Wing Admin Offices ----
    { id: '114', label: 'Admin Office', floor: 1, gridX: 35, gridY: 1,  gridW: 4, gridH: 4, color: C.office, type: 'office' },

    // ---- Right Wing Bottom Row ----
    { id: '115', label: 'Room 115',     floor: 1, gridX: 23, gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '116', label: 'Room 116',     floor: 1, gridX: 27, gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },

    // ---- Registrar & Bursar (bottom right) ----
    { id: '117', label: "Registrar's",  floor: 1, gridX: 31, gridY: 13, gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '118', label: "Bursar's",     floor: 1, gridX: 35, gridY: 13, gridW: 4, gridH: 4, color: C.office, type: 'office' },
  ],

  corridors: [
    // Left wing horizontal corridor — from stairwell (x=2) to centre
    { x: 2, y: 5, w: 15, h: 8 },
    // Central vertical connector (between Dean's Office and Lobby)
    { x: 17, y: 6, w: 6, h: 4 },
    // Right wing horizontal corridor — from centre to stairwell (x=38)
    { x: 23, y: 5, w: 15, h: 8 },
    // Entrance from bottom
    { x: 18, y: 17, w: 4, h: 3 },
  ],
  stairs: [
    { x: 0, y: 7, w: 2, h: 6, label: 'L Stairs' },
    { x: 38, y: 7, w: 2, h: 6, label: 'R Stairs' },
  ],
  walls: [],

  defaultSource: { row: 19, col: 20 }, // Main Entrance
}

/* ==================================================================
   FLOOR 2 – Classrooms
   Based on "Second Floor" blueprint:
   - Same H-shape, central corridor instead of lobby
   - Named rooms (Prof Clarke, Prof Lincoln offices)
   ================================================================ */

const floor2: FloorLayout = {
  floor: 2,
  label: 'Second Floor',
  rooms: [
    // ---- Left Wing Top Row ----
    { id: '201', label: 'Room 201',     floor: 2, gridX: 1,  gridY: 1, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '202', label: 'Room 202',     floor: 2, gridX: 5,  gridY: 1, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '203', label: 'Room 203',     floor: 2, gridX: 9,  gridY: 1, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '204', label: 'Room 204',     floor: 2, gridX: 13, gridY: 1, gridW: 4, gridH: 4, color: C.room, type: 'room' },

    // ---- Left Wing Bottom Row ----
    { id: '205', label: 'Room 205',     floor: 2, gridX: 1,  gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '206', label: 'Room 206',     floor: 2, gridX: 5,  gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '207', label: 'Room 207',     floor: 2, gridX: 9,  gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '208', label: 'Room 208',     floor: 2, gridX: 13, gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },

    // ---- Central Top (Prof Clarke's Office) ----
    { id: '209', label: "Prof Clarke",  floor: 2, gridX: 17, gridY: 1, gridW: 6, gridH: 5, color: C.office, type: 'office' },

    // ---- Central Bottom (Prof Lincoln's Office) ----
    { id: '210', label: "Prof Lincoln", floor: 2, gridX: 17, gridY: 12, gridW: 6, gridH: 5, color: C.office, type: 'office' },

    // ---- Right Wing Top Row ----
    { id: '211', label: 'Room 211',     floor: 2, gridX: 23, gridY: 1, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '212', label: 'Room 212',     floor: 2, gridX: 27, gridY: 1, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '213', label: 'Room 213',     floor: 2, gridX: 31, gridY: 1, gridW: 4, gridH: 4, color: C.room, type: 'room' },

    // ---- Registrar's House (top right) ----
    { id: '214', label: "Registrar's House", floor: 2, gridX: 35, gridY: 1, gridW: 4, gridH: 4, color: C.office, type: 'office' },

    // ---- Right Wing Bottom Row ----
    { id: '215', label: 'Room 215',     floor: 2, gridX: 23, gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '216', label: 'Room 216',     floor: 2, gridX: 27, gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '217', label: 'Room 217',     floor: 2, gridX: 31, gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '218', label: 'Room 218',     floor: 2, gridX: 35, gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
  ],

  corridors: [
    { x: 2, y: 5, w: 15, h: 8 },
    { x: 17, y: 6, w: 6, h: 6 },
    { x: 23, y: 5, w: 15, h: 8 },
  ],
  stairs: [
    { x: 0, y: 7, w: 2, h: 6, label: 'L Stairs' },
    { x: 38, y: 7, w: 2, h: 6, label: 'R Stairs' },
  ],
  walls: [],

  defaultSource: { row: 9, col: 20 }, // Center corridor
}

/* ==================================================================
   FLOOR 3 – Labs & Seminar Rooms
   ================================================================ */

const floor3: FloorLayout = {
  floor: 3,
  label: 'Third Floor',
  rooms: [
    { id: '301', label: 'Lab 301',     floor: 3, gridX: 1,  gridY: 1,  gridW: 4, gridH: 4, color: C.lab, type: 'lab' },
    { id: '302', label: 'Lab 302',     floor: 3, gridX: 5,  gridY: 1,  gridW: 4, gridH: 4, color: C.lab, type: 'lab' },
    { id: '303', label: 'Room 303',    floor: 3, gridX: 9,  gridY: 1,  gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '304', label: 'Room 304',    floor: 3, gridX: 13, gridY: 1,  gridW: 4, gridH: 4, color: C.room, type: 'room' },

    { id: '305', label: 'Lab 305',     floor: 3, gridX: 1,  gridY: 13, gridW: 4, gridH: 4, color: C.lab, type: 'lab' },
    { id: '306', label: 'Lab 306',     floor: 3, gridX: 5,  gridY: 13, gridW: 4, gridH: 4, color: C.lab, type: 'lab' },
    { id: '307', label: 'Room 307',    floor: 3, gridX: 9,  gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '308', label: 'Room 308',    floor: 3, gridX: 13, gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },

    { id: '309', label: 'Seminar Hall', floor: 3, gridX: 17, gridY: 1,  gridW: 6, gridH: 5, color: C.lobby, type: 'room' },
    { id: '310', label: 'Conference',   floor: 3, gridX: 17, gridY: 12, gridW: 6, gridH: 5, color: C.lobby, type: 'room' },

    { id: '311', label: 'Room 311',    floor: 3, gridX: 23, gridY: 1,  gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '312', label: 'Room 312',    floor: 3, gridX: 27, gridY: 1,  gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '313', label: 'Lab 313',     floor: 3, gridX: 31, gridY: 1,  gridW: 4, gridH: 4, color: C.lab, type: 'lab' },
    { id: '314', label: 'Lab 314',     floor: 3, gridX: 35, gridY: 1,  gridW: 4, gridH: 4, color: C.lab, type: 'lab' },

    { id: '315', label: 'Room 315',    floor: 3, gridX: 23, gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '316', label: 'Room 316',    floor: 3, gridX: 27, gridY: 13, gridW: 4, gridH: 4, color: C.room, type: 'room' },
    { id: '317', label: 'Lab 317',     floor: 3, gridX: 31, gridY: 13, gridW: 4, gridH: 4, color: C.lab, type: 'lab' },
    { id: '318', label: 'Server Room', floor: 3, gridX: 35, gridY: 13, gridW: 4, gridH: 4, color: C.utility, type: 'utility' },
  ],

  corridors: [
    { x: 2, y: 5, w: 15, h: 8 },
    { x: 17, y: 6, w: 6, h: 6 },
    { x: 23, y: 5, w: 15, h: 8 },
  ],
  stairs: [
    { x: 0, y: 7, w: 2, h: 6, label: 'L Stairs' },
    { x: 38, y: 7, w: 2, h: 6, label: 'R Stairs' },
  ],
  walls: [],

  defaultSource: { row: 9, col: 20 },
}

/* ==================================================================
   FLOOR 4 – Research & Faculty
   ================================================================ */

const floor4: FloorLayout = {
  floor: 4,
  label: 'Fourth Floor',
  rooms: [
    { id: '401', label: 'Faculty 401', floor: 4, gridX: 1,  gridY: 1,  gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '402', label: 'Faculty 402', floor: 4, gridX: 5,  gridY: 1,  gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '403', label: 'Faculty 403', floor: 4, gridX: 9,  gridY: 1,  gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '404', label: 'Faculty 404', floor: 4, gridX: 13, gridY: 1,  gridW: 4, gridH: 4, color: C.office, type: 'office' },

    { id: '405', label: 'Faculty 405', floor: 4, gridX: 1,  gridY: 13, gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '406', label: 'Faculty 406', floor: 4, gridX: 5,  gridY: 13, gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '407', label: 'Faculty 407', floor: 4, gridX: 9,  gridY: 13, gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '408', label: 'Faculty 408', floor: 4, gridX: 13, gridY: 13, gridW: 4, gridH: 4, color: C.office, type: 'office' },

    { id: '409', label: 'Research Lab', floor: 4, gridX: 17, gridY: 1,  gridW: 6, gridH: 5, color: C.lab, type: 'lab' },
    { id: '410', label: 'Study Hall',   floor: 4, gridX: 17, gridY: 12, gridW: 6, gridH: 5, color: C.lobby, type: 'room' },

    { id: '411', label: 'Faculty 411', floor: 4, gridX: 23, gridY: 1,  gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '412', label: 'Faculty 412', floor: 4, gridX: 27, gridY: 1,  gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '413', label: 'Faculty 413', floor: 4, gridX: 31, gridY: 1,  gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '414', label: 'Faculty 414', floor: 4, gridX: 35, gridY: 1,  gridW: 4, gridH: 4, color: C.office, type: 'office' },

    { id: '415', label: 'Faculty 415', floor: 4, gridX: 23, gridY: 13, gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '416', label: 'Faculty 416', floor: 4, gridX: 27, gridY: 13, gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '417', label: 'Faculty 417', floor: 4, gridX: 31, gridY: 13, gridW: 4, gridH: 4, color: C.office, type: 'office' },
    { id: '418', label: 'Faculty 418', floor: 4, gridX: 35, gridY: 13, gridW: 4, gridH: 4, color: C.office, type: 'office' },
  ],

  corridors: [
    { x: 2, y: 5, w: 15, h: 8 },
    { x: 17, y: 6, w: 6, h: 6 },
    { x: 23, y: 5, w: 15, h: 8 },
  ],
  stairs: [
    { x: 0, y: 7, w: 2, h: 6, label: 'L Stairs' },
    { x: 38, y: 7, w: 2, h: 6, label: 'R Stairs' },
  ],
  walls: [],

  defaultSource: { row: 9, col: 20 },
}

/* ---------- Export all floors ------------------------------------- */

export const FLOORS: FloorLayout[] = [floor1, floor2, floor3, floor4]

export function getFloor(floorNumber: number): FloorLayout {
  return FLOORS.find(f => f.floor === floorNumber) || floor1
}

/** Get all rooms across all floors */
export function getAllRooms(): RoomDef[] {
  return FLOORS.flatMap(f => f.rooms)
}

/** Get rooms for a specific floor */
export function getRoomsByFloor(floorNumber: number): RoomDef[] {
  return getFloor(floorNumber).rooms
}

/** Find a room by its ID (e.g. "204") across all floors */
export function findRoomById(id: string): RoomDef | undefined {
  return getAllRooms().find(r => r.id === id)
}

/** Determine which floor a room Id belongs to */
export function getFloorFromRoomId(roomId: string): number {
  const num = parseInt(roomId, 10)
  if (isNaN(num)) return 1
  return Math.floor(num / 100)
}
