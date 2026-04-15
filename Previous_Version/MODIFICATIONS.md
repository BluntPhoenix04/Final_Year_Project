# CampNav — Project Modifications & Feature Documentation

> **Project:** Campus Navigation & Smart Services Platform  
> **Version:** Previous_Version (Latest)  
> **Last Updated:** April 2026  
> **Contributors:** Siddhant K. Singh

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Architecture Overview](#3-architecture-overview)
4. [Feature 1: Role-Based Authentication System](#4-feature-1-role-based-authentication-system)
5. [Feature 2: MongoDB Database Integration](#5-feature-2-mongodb-database-integration)
6. [Feature 3: Faculty Room Booking System](#6-feature-3-faculty-room-booking-system)
7. [Feature 4: Smart Help Desk & Ticketing](#7-feature-4-smart-help-desk--ticketing)
8. [Feature 5: Admin Panel & Campus Analytics](#8-feature-5-admin-panel--campus-analytics)
9. [Feature 6: Role-Aware Navigation & Sidebar](#9-feature-6-role-aware-navigation--sidebar)
10. [Feature 7: Enhanced Dashboard with Tabs](#10-feature-7-enhanced-dashboard-with-tabs)
11. [Feature 8: Database Seeding Script](#11-feature-8-database-seeding-script)
12. [File-Level Change Log](#12-file-level-change-log)
13. [API Reference](#13-api-reference)
14. [Database Schema Reference](#14-database-schema-reference)
15. [Setup & Running Instructions](#15-setup--running-instructions)
16. [Demo Accounts](#16-demo-accounts)

---

## 1. Project Overview

**CampNav** is a campus navigation and smart services platform built with Next.js. The project enables students, faculty, and administrators to:

- Navigate campus buildings with a 3D multi-floor interactive map
- View personalized class schedules and timetables
- Book classrooms and labs (faculty only)
- Submit and track support tickets via a smart help desk
- Monitor campus analytics and manage infrastructure (admin only)

### Key Modifications Summary

| Feature | Description | Impact |
|---------|-------------|--------|
| **Role-Based Auth** | JWT-authenticated login/signup with 3 roles (student, faculty, admin) | All pages now gate functionality by role |
| **MongoDB Integration** | Persistent backend using Mongoose + MongoDB Atlas | Replaced all mock/local state with real DB |
| **Room Booking** | Faculty can book rooms with conflict detection | New API route + booking modal component |
| **Help Desk** | Support ticket system with CRUD operations | New API route + helpdesk page updates |
| **Admin Panel** | Full-page admin dashboard with analytics, room management, booking oversight, and ticket management | New page + 4 tabbed sections |
| **Sidebar & Navbar** | Role-aware navigation with admin section | Conditional rendering based on stored role |
| **DB Seeding** | Automated seed script for demo data | 7 users + 5 tickets pre-populated |

---

## 2. Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.2.2 | React framework with App Router |
| React | 19.2.4 | UI library |
| TypeScript | 5.7.3 | Type safety |
| Tailwind CSS | 4.2.0 | Utility-first styling |
| Radix UI | Various | Accessible UI primitives (Dialog, Select, Tabs, etc.) |
| Lucide React | 0.564.0 | Icon library |
| Recharts | 2.15.0 | Data visualization |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | — | RESTful API endpoints |
| MongoDB | 7.1.1 | NoSQL database (via Atlas) |
| Mongoose | 9.4.1 | ODM for MongoDB |
| bcryptjs | 3.0.3 | Password hashing (12 salt rounds) |
| jsonwebtoken | 9.0.3 | JWT token generation & verification |

### New Dependencies Added
```json
{
  "bcryptjs": "^3.0.3",
  "jsonwebtoken": "^9.0.3",
  "mongodb": "^7.1.1",
  "mongoose": "^9.4.1",
  "@types/bcryptjs": "^2.4.6",
  "@types/jsonwebtoken": "^9.0.10",
  "dotenv": "^17.4.2",
  "ts-node": "^10.9.2"
}
```

---

## 3. Architecture Overview

```
Previous_Version/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx          ← [MODIFIED] Role-based login with API
│   │   └── signup/page.tsx         ← [MODIFIED] Role-based signup with API
│   ├── (dashboard)/dashboard/
│   │   ├── page.tsx                ← [MODIFIED] Enhanced dashboard with booking tab
│   │   ├── admin/page.tsx          ← [NEW] Full admin panel
│   │   ├── helpdesk/page.tsx       ← [MODIFIED] Ticket submission
│   │   ├── schedule/page.tsx       ← [MODIFIED] Role-based schedule
│   │   └── navigate/page.tsx       ← Existing 3D navigation
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts      ← [NEW] Login API
│       │   └── signup/route.ts     ← [NEW] Signup API
│       ├── bookings/route.ts       ← [NEW] Booking CRUD API
│       └── tickets/route.ts        ← [NEW] Ticket CRUD API
├── components/
│   ├── dashboard/
│   │   └── booking-modal.tsx       ← [MODIFIED] Server-backed booking modal
│   └── layout/
│       ├── sidebar.tsx             ← [MODIFIED] Admin nav link, role-aware
│       └── navbar.tsx              ← [MODIFIED] Role badge, role-specific notifications
├── lib/
│   ├── auth.ts                     ← [NEW] JWT sign/verify/extract helpers
│   ├── db/
│   │   ├── mongoose.ts             ← [NEW] MongoDB connection with caching
│   │   └── models/
│   │       ├── User.ts             ← [NEW] User schema with embedded timetable
│   │       ├── Booking.ts          ← [NEW] Booking schema
│   │       └── Ticket.ts           ← [NEW] Ticket schema
│   └── mock-data.ts                ← [MODIFIED] Updated room/timetable data
├── scripts/
│   ├── seed.ts                     ← [NEW] Database seed script
│   └── test-mongo.js               ← [NEW] MongoDB connection tester
└── package.json                    ← [MODIFIED] Added new dependencies + seed script
```

---

## 4. Feature 1: Role-Based Authentication System

### Overview
Replaced the previous mock/demo authentication with a fully functional JWT-based system supporting three user roles: **Student**, **Faculty**, and **Admin**.

### How It Works

1. **User selects a role** (Student / Faculty / Admin) on the login page
2. **Credentials are validated** against MongoDB (email + bcrypt password hash)
3. **Role verification** — the selected role must match the DB-stored role
4. **JWT token** is issued with 7-day expiry containing `userId`, `email`, `name`, `role`
5. **Client stores** `auth_token`, `user_role`, `user_email`, `user_name`, `user_timetable` in `localStorage`

### Security Features
- **Domain-restricted emails**: Only `@univ.edu.in` addresses are accepted
- **Admin self-registration blocked**: Admin accounts can only be seeded, never self-created
- **Password hashing**: bcrypt with 12 salt rounds
- **Role mismatch detection**: Prevents a student from logging in as faculty

### Files Modified/Created

| File | Change |
|------|--------|
| `app/(auth)/login/page.tsx` | **MODIFIED** — Added role selector (Student/Faculty/Admin), API-based login via `POST /api/auth/login`, stores JWT + user data in localStorage |
| `app/(auth)/signup/page.tsx` | **MODIFIED** — Added role selector (Student/Faculty only), API-based signup via `POST /api/auth/signup`, admin registration blocked |
| `app/api/auth/login/route.ts` | **NEW** — Login endpoint with bcrypt verification, role validation, JWT token issuance |
| `app/api/auth/signup/route.ts` | **NEW** — Signup endpoint with password hashing, duplicate detection, admin block |
| `lib/auth.ts` | **NEW** — `signToken()`, `verifyToken()`, `getUserFromHeader()` utility functions |

---

## 5. Feature 2: MongoDB Database Integration

### Overview
Integrated MongoDB (via Mongoose) as the persistent backend, replacing in-memory/mock data for users, bookings, and support tickets.

### Connection Strategy
- Uses a **singleton pattern** with global caching to prevent connection leaks during Next.js hot reloads
- Connection string stored in `.env.local` as `MONGODB_URI`
- `bufferCommands: false` for predictable error handling

### Files Created

| File | Purpose |
|------|---------|
| `lib/db/mongoose.ts` | MongoDB connection helper with global caching |
| `lib/db/models/User.ts` | User model — name, email, password, role, embedded timetable |
| `lib/db/models/Booking.ts` | Booking model — room details, date, time range, purpose, attendees |
| `lib/db/models/Ticket.ts` | Ticket model — subject, category, status, priority, submittedBy |

### Environment Variables Required
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=<any-random-secret-string>
```

---

## 6. Feature 3: Faculty Room Booking System

### Overview
Faculty members can book available classrooms and labs with **automatic conflict detection**. Bookings persist in MongoDB and are visible across the dashboard and admin panel.

### User Flow
1. Faculty navigates to **Dashboard → Explore Rooms** tab
2. Clicks **"Book"** on any available room card
3. **Booking modal** opens with room selector, date, time range, attendees, purpose
4. On submit, the API checks for **time conflicts** on the same room + date
5. If no conflict → booking is created and appears in "My Bookings" tab
6. Faculty can **cancel** their own bookings; Admin can cancel any booking

### Conflict Detection Logic
```
A conflict exists if:
  same roomId AND same date AND
  (new.startTime < existing.endTime AND new.endTime > existing.startTime)
```

### Files Modified/Created

| File | Change |
|------|--------|
| `app/api/bookings/route.ts` | **NEW** — GET (fetch bookings), POST (create with conflict detection), DELETE (cancel) |
| `components/dashboard/booking-modal.tsx` | **MODIFIED** — Now posts to `/api/bookings`, shows conflict errors, floor-grouped room selector |
| `app/(dashboard)/dashboard/page.tsx` | **MODIFIED** — Added "My Bookings" tab for faculty/admin, real-time booking fetch/cancel |

### API Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/api/bookings` | Faculty/Admin | Fetch all bookings |
| `POST` | `/api/bookings` | Faculty only | Create booking (with conflict check) |
| `DELETE` | `/api/bookings?id=<id>` | Owner/Admin | Cancel a booking |

---

## 7. Feature 4: Smart Help Desk & Ticketing

### Overview
Users can submit support tickets categorized by type (Technical, Facilities, Navigation, Room Booking). Tickets are stored in MongoDB and manageable by admins.

### User Flow
1. Any logged-in user submits a ticket via **Dashboard → Help Desk**
2. Ticket includes: subject, category, priority, message
3. Tickets appear in the user's personal ticket list
4. **Admins** can view all tickets, change status (Open → In Progress → Resolved), or delete them

### Files Modified/Created

| File | Change |
|------|--------|
| `app/api/tickets/route.ts` | **NEW** — GET (admin: all, others: own), POST (create), PUT (admin: update status), DELETE (admin: delete) |
| `app/(dashboard)/dashboard/helpdesk/page.tsx` | **MODIFIED** — Category-based ticket form, personal ticket list sidebar |

### API Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/api/tickets` | Any (filtered) | Admin sees all; others see own |
| `POST` | `/api/tickets` | Any | Submit a ticket |
| `PUT` | `/api/tickets` | Admin only | Update ticket status |
| `DELETE` | `/api/tickets?id=<id>` | Admin only | Delete ticket |

---

## 8. Feature 5: Admin Panel & Campus Analytics

### Overview
A comprehensive admin-only dashboard page (`/dashboard/admin`) with 4 tabbed sections providing full campus infrastructure control.

### Access Control
- Route-guarded: non-admin users are redirected to `/dashboard`
- Sidebar shows "Admin Panel" link only for admin role

### Tabs & Functionality

#### Tab 1: Analytics
- **Room Usage Frequency** — Horizontal bar chart ranking rooms by total booking count
- **Availability Breakdown** — Status distribution (Available / In Use / Maintenance / Locked) with progress bars
- **Class Schedule Insights** — Dot-matrix showing class count per weekday
- **System Bookings Summary** — Aggregated booking counts per room from MongoDB

#### Tab 2: Rooms Management
- Lists all campus rooms with current status
- **Colored status dots** to toggle room status: 🟢 Available → 🟠 In Use → 🔴 Maintenance → ⚫ Locked
- Reset All button to restore defaults

#### Tab 3: All Bookings
- Shows every booking in the system (from all faculty)
- Admin can **cancel any booking** directly
- Displays room name, building, floor, date, time, purpose, attendees

#### Tab 4: Support Tickets
- Shows all support tickets from MongoDB
- Actions per ticket: **Mark In Progress**, **Resolve**, **Delete**
- Color-coded priority badges (High/Medium/Low)
- Live counters for Open and In Progress tickets

### KPI Stats Row (Top of Page)
| Metric | Description |
|--------|-------------|
| Total Rooms | Count of all campus rooms |
| Available | Rooms with "available" status |
| In Use | Rooms currently in use |
| Maintenance | Rooms under maintenance |
| Locked | Rooms that are locked |
| Occupancy % | Overall seat occupancy rate |
| Open Tickets | Unresolved support tickets |

### Files Created

| File | Change |
|------|--------|
| `app/(dashboard)/dashboard/admin/page.tsx` | **NEW** — 580-line admin panel with 4 tabs, analytics, room management, bookings and tickets |

---

## 9. Feature 6: Role-Aware Navigation & Sidebar

### Overview
The sidebar and navbar dynamically adapt based on the logged-in user's role.

### Sidebar Changes
- **Admin users** see an additional **"Admin Panel"** link styled with a red accent and shield icon
- The link is visually distinct: red border, red text when inactive; solid red background when active
- Logo subtitle changes to "Admin Console" for admins
- **Logout** clears all `localStorage` keys and redirects to `/login`

### Navbar Changes
- **Role badge** displayed next to "Dashboard" header: Student (green), Faculty (blue), Admin (red)
- **Notifications dropdown** shows role-specific notifications:
  - Admin: "New Support Ticket" notifications
  - Faculty: "Booking Confirmed" notifications
  - All: "Class starting soon" + "System Update"
- **User profile dropdown** with email, role, and logout

### Files Modified

| File | Change |
|------|--------|
| `components/layout/sidebar.tsx` | **MODIFIED** — Conditional admin nav item, role-based styling, proper logout |
| `components/layout/navbar.tsx` | **MODIFIED** — Role badge, role-specific notifications, improved profile dropdown |

---

## 10. Feature 7: Enhanced Dashboard with Tabs

### Overview
The main dashboard page was refactored with a tabbed interface that adapts based on user role.

### Tab Structure
| Tab | Visible To | Content |
|-----|-----------|---------|
| Explore Rooms | All | Room cards with Navigate + Book buttons |
| My Classes | All | Personal timetable from user profile |
| My Bookings | Faculty/Admin only | List of personal bookings with cancel option |

### Quick Stats Cards
- **Available Rooms** — count of rooms with "available" status
- **Today's Classes** — count from user's timetable
- **My Bookings** — (faculty/admin only) count of active bookings
- **Role** — displays current user role

### Data Flow
- Timetable loaded from `localStorage` (set during login from MongoDB)
- Bookings fetched from `GET /api/bookings` with JWT authorization
- Cancel triggers `DELETE /api/bookings?id=<id>` and updates state

### Files Modified

| File | Change |
|------|--------|
| `app/(dashboard)/dashboard/page.tsx` | **MODIFIED** — Added booking tab, API-based data fetching, role-conditional UI |

---

## 11. Feature 8: Database Seeding Script

### Overview
A TypeScript seed script that populates MongoDB with demo data for testing and demonstration.

### Seeded Data

| Collection | Count | Details |
|------------|-------|---------|
| Users | 7 | 1 Admin, 3 Faculty, 3 Students |
| Tickets | 5 | Various categories and priorities |
| Bookings | 0 | Clean start (created via app usage) |

### Student Timetable Tracks
- **Alice Sharma** — CS Track (CS101, MATH201, CS301, CS405, MATH301)
- **Bob Mehta** — Science Track (PHYS101, CHEM201, PHYS301, BIO102, ENV201)
- **Charlie Patel** — Arts Track (ENG102, HIST201, PSYC101, ECON301, ART201)

### Running the Seed
```bash
npm run seed
```

### Files Created

| File | Change |
|------|--------|
| `scripts/seed.ts` | **NEW** — Seeds 7 users (with hashed passwords & timetables) + 5 tickets |
| `scripts/test-mongo.js` | **NEW** — Simple MongoDB connection verification script |

---

## 12. File-Level Change Log

### New Files (12 files)

| File | Lines | Purpose |
|------|-------|---------|
| `app/api/auth/login/route.ts` | 64 | Login API endpoint |
| `app/api/auth/signup/route.ts` | 67 | Signup API endpoint |
| `app/api/bookings/route.ts` | 94 | Booking CRUD API |
| `app/api/tickets/route.ts` | 82 | Ticket CRUD API |
| `app/(dashboard)/dashboard/admin/page.tsx` | 580 | Admin panel page |
| `lib/auth.ts` | 29 | JWT authentication utilities |
| `lib/db/mongoose.ts` | 33 | MongoDB connection helper |
| `lib/db/models/User.ts` | 51 | User Mongoose model |
| `lib/db/models/Booking.ts` | 36 | Booking Mongoose model |
| `lib/db/models/Ticket.ts` | 26 | Ticket Mongoose model |
| `scripts/seed.ts` | 169 | Database seeding script |
| `scripts/test-mongo.js` | ~20 | MongoDB connection tester |

### Modified Files (11 files)

| File | Key Changes |
|------|-------------|
| `app/(auth)/login/page.tsx` | Role selector, API-based auth, JWT storage |
| `app/(auth)/signup/page.tsx` | Role selector, API-based signup, admin block |
| `app/(dashboard)/dashboard/page.tsx` | Booking tab, API data fetching, role-conditional UI |
| `app/(dashboard)/dashboard/helpdesk/page.tsx` | Category-based ticket form |
| `app/(dashboard)/dashboard/schedule/page.tsx` | Role-based schedule display |
| `components/dashboard/booking-modal.tsx` | Server-backed with conflict detection |
| `components/layout/sidebar.tsx` | Admin nav link, role-aware styling, logout |
| `components/layout/navbar.tsx` | Role badge, role-specific notifications |
| `lib/mock-data.ts` | Updated room/timetable data |
| `package.json` | Added 8 new dependencies + seed script |
| `package-lock.json` | Lock file updated |

### Total Impact
- **23 files changed**
- **2,348 lines added**, 262 lines removed

---

## 13. API Reference

### Authentication

#### `POST /api/auth/login`
**Body:**
```json
{
  "email": "alice@univ.edu.in",
  "password": "Student@123",
  "role": "student"
}
```
**Response (200):**
```json
{
  "token": "eyJhbGciOi...",
  "user": {
    "id": "663...",
    "name": "Alice Sharma",
    "email": "alice@univ.edu.in",
    "role": "student",
    "timetable": [...]
  }
}
```
**Errors:** `400` (missing fields), `401` (wrong credentials), `403` (wrong domain or role mismatch)

---

#### `POST /api/auth/signup`
**Body:**
```json
{
  "name": "New Student",
  "email": "newuser@univ.edu.in",
  "password": "MyPass@123",
  "role": "student"
}
```
**Response (201):** Same shape as login  
**Errors:** `400` (missing fields), `403` (admin blocked or wrong domain), `409` (email exists)

---

### Bookings

> All booking endpoints require `Authorization: Bearer <token>` header.

#### `GET /api/bookings`
Returns all bookings for admin/faculty, empty array for students.

#### `POST /api/bookings`
**Faculty only.** Creates a booking with conflict detection.  
**Body:**
```json
{
  "roomId": "101",
  "roomName": "Room 101 - CS Lab",
  "building": "CS Block",
  "floor": 1,
  "date": "2026-04-20",
  "startTime": "09:00",
  "endTime": "11:00",
  "purpose": "Lecture",
  "attendees": 30
}
```
**Error (409):** Room conflict with existing booking details.

#### `DELETE /api/bookings?id=<booking_id>`
Cancels a booking. Owner or admin only.

---

### Tickets

> All ticket endpoints require `Authorization: Bearer <token>` header.

#### `GET /api/tickets`
Admin: returns all tickets. Others: returns only own tickets.

#### `POST /api/tickets`
Any logged-in user.  
**Body:**
```json
{
  "subject": "Broken projector",
  "category": "Technical Support",
  "priority": "high",
  "message": "The projector in Room 301 is not working."
}
```

#### `PUT /api/tickets`
**Admin only.** Updates ticket status.  
**Body:** `{ "id": "<ticket_id>", "status": "in-progress" }`

#### `DELETE /api/tickets?id=<ticket_id>`
**Admin only.** Deletes a ticket.

---

## 14. Database Schema Reference

### Users Collection
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | String | ✅ | Full name |
| `email` | String | ✅ | Unique, lowercase, `@univ.edu.in` |
| `password` | String | ✅ | bcrypt hash (12 rounds) |
| `role` | Enum | ✅ | `student` \| `faculty` \| `admin` |
| `timetable` | Array | ❌ | Embedded class schedule entries |
| `createdAt` | Date | Auto | Mongoose timestamp |

### Bookings Collection
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `roomId` | String | ✅ | Room identifier |
| `roomName` | String | ✅ | Display name |
| `building` | String | ✅ | Building name |
| `floor` | Number | ✅ | Floor number |
| `date` | String | ✅ | ISO date e.g. `"2026-04-20"` |
| `startTime` | String | ✅ | e.g. `"09:00"` |
| `endTime` | String | ✅ | e.g. `"11:00"` |
| `purpose` | String | ✅ | Booking purpose |
| `attendees` | Number | ✅ | Number of attendees |
| `userId` | String | ✅ | Booking owner (email) |
| `userName` | String | ✅ | Booking owner name |

### Tickets Collection
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subject` | String | ✅ | Ticket title |
| `category` | String | ✅ | Category name |
| `status` | Enum | ✅ | `open` \| `in-progress` \| `resolved` |
| `priority` | Enum | ✅ | `low` \| `medium` \| `high` |
| `submittedBy` | String | ✅ | User email |
| `message` | String | ❌ | Additional details |

---

## 15. Setup & Running Instructions

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB instance)

### Step 1: Install Dependencies
```bash
cd Previous_Version
npm install
```

### Step 2: Configure Environment
Create `.env.local` in the project root:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/campnav
JWT_SECRET=your-secret-key-here
```

### Step 3: Seed the Database
```bash
npm run seed
```
This creates 7 users, 5 support tickets, and prints login credentials.

### Step 4: Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 16. Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| 🔧 Admin | `admin@univ.edu.in` | `Admin@123` |
| 📖 Faculty | `dr.smith@univ.edu.in` | `Faculty@123` |
| 📖 Faculty | `prof.johnson@univ.edu.in` | `Faculty@123` |
| 📖 Faculty | `dr.williams@univ.edu.in` | `Faculty@123` |
| 🎓 Student | `alice@univ.edu.in` | `Student@123` |
| 🎓 Student | `bob@univ.edu.in` | `Student@123` |
| 🎓 Student | `charlie@univ.edu.in` | `Student@123` |

---

*End of Modifications Document*
