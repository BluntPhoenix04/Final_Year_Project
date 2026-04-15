# 🎓 CampNav — Campus Navigation & Management System

A full-stack web application designed to streamline campus navigation, room booking, timetable management, and support ticketing for students, faculty, and administrators.

---

## 🌐 Live Demo

🔗 **[campnav.vercel.app](https://final-year-project-siddhants-projects-5d7e52f4.vercel.app)**

---

## ✨ Features

### 🔐 Authentication & Roles
- JWT-based secure authentication
- Role-based access control: **Student**, **Faculty**, **Admin**
- Domain-restricted signup (`@univ.edu.in`)

### 🗺️ Campus Navigation
- Interactive campus map with building markers
- Pathfinding using **BFS** and **Dijkstra's Algorithm**
- Real-time directions between campus locations

### 📅 Room Booking *(Faculty Only)*
- Browse available rooms with real-time status
- Server-side conflict detection to prevent double-booking
- View and manage your own bookings

### 🧾 Timetable
- Role-specific timetable view
- Faculty see subject-wise lecture schedules
- Students see their enrolled class schedules

### 🎫 Help Desk
- Submit and track support tickets
- Admins can update ticket statuses and resolve issues

### 🛡️ Admin Dashboard
- Analytics overview: users, bookings, open tickets
- Room status management (Available / Occupied / Maintenance)
- Booking oversight and cancellation
- Ticket resolution interface

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Frontend** | React 19, Tailwind CSS, Lucide React |
| **Backend** | Next.js API Routes |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JWT (jsonwebtoken) + bcryptjs |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
Frontend/
├── app/
│   ├── (auth)/           # Login & Signup pages
│   ├── (dashboard)/      # Dashboard, Admin, Helpdesk, Navigation, Booking
│   └── api/              # API routes (auth, bookings, tickets)
├── components/
│   ├── dashboard/        # Booking modal, room cards
│   ├── layout/           # Navbar, Sidebar
│   └── map/              # Campus map components
├── lib/
│   ├── auth.ts           # JWT utility
│   ├── algorithms.ts     # BFS & Dijkstra pathfinding
│   └── db/               # MongoDB connection + Mongoose models
└── scripts/
    └── seed.ts           # Database seeding script
```

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### Installation

```bash
# Clone the repository
git clone https://github.com/BluntPhoenix04/Final_Year_Project.git
cd Final_Year_Project/Frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in MONGODB_URI and JWT_SECRET

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Environment Variables

Create a `.env.local` file inside the `Frontend/` directory:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

---

## 🌱 Database Seeding

To populate the database with demo users and data:

```bash
cd Frontend
npx ts-node scripts/seed.ts
```

**Demo Accounts:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@univ.edu.in | admin123 |
| Faculty | faculty@univ.edu.in | faculty123 |
| Student | student@univ.edu.in | student123 |

---

## 👨‍💻 Author

**Siddhant K. Singh**
Final Year Project — B.Tech Computer Science
