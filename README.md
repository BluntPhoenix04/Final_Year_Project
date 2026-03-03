# CampNav - Smart Campus Navigation System

A modern, role-based campus navigation and help desk system built with Next.js, React, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication
- **Three-Way Login**: Student, Teacher, and Admin roles
- Secure registration system
- Session-based authentication with local storage persistence

### 👨‍🎓 Student Dashboard
- View today's timetable with class details
- Interactive floor-based campus map
- Find classrooms with room availability
- Real-time navigation assistance
- Smart chatbot assistant

### 👨‍🏫 Teacher Dashboard
- Teaching timetable management
- Empty classroom booking system
- Floor-based navigation
- Booking history and confirmation tracking
- Help desk access

### 👨‍💼 Admin Dashboard
- Campus statistics overview
- Recent activity monitoring
- Floor usage analytics
- Room management controls
- User activity tracking

### 🤖 Smart Chatbot
- Intelligent question answering
- Predefined helpful responses
- Quick question suggestions
- Available across all pages

### 🗺️ Live Navigation
- Full-width blueprint-style campus map
- Zoom and pan controls
- Step-by-step directions
- Distance and time estimates
- Current location tracking

## Tech Stack

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Icons**: Lucide React

## Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── components/
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── TopNavbar.tsx         # Top navigation bar
│   ├── DashboardLayout.tsx   # Dashboard wrapper
│   ├── Chatbot.tsx           # AI assistant chatbot
│   ├── Map.tsx               # Floor map component
│   ├── RoomInfoPanel.tsx     # Room details panel
│   ├── FloorSwitcher.tsx     # Floor selection
│   └── BookingModal.tsx      # Classroom booking modal
├── context/
│   └── AuthContext.tsx       # Authentication context
├── login/                    # Login page
├── register/                 # Registration page
├── student/                  # Student dashboard
├── teacher/                  # Teacher dashboard
├── admin/                    # Admin dashboard
├── navigation/               # Live navigation page
├── layout.tsx
├── page.tsx
└── globals.css
```

## Authentication Flow

### Default Login
- Visit [http://localhost:3000/login](http://localhost:3000/login)
- Select your role: **Student**, **Teacher**, or **Admin**
- Use demo credentials:
  - Email: `demo@example.com`
  - Password: `password`
- Automatically redirected to your role-based dashboard

### New Registration
- Visit [http://localhost:3000/register](http://localhost:3000/register)
- Enter your details and select role
- Create an account and login

## Dashboards Overview

### Student Dashboard (`/student`)
- **Timetable Section**: View daily classes with room locations and times
- **Navigation Section**: Interactive campus map with floor switcher
- **Room Selection**: Click rooms to see availability and details
- **Find Room Button**: Quick access to specific classrooms

### Teacher Dashboard (`/teacher`)
- **Teaching Timetable**: Manage your daily schedule
- **Booking Section**: Book empty classrooms for additional sessions
- **Room Navigation**: Browse and locate classrooms
- **Booking Management**: View and manage your bookings

### Admin Dashboard (`/admin`)
- **Statistics Cards**: Total students, classrooms, bookings, alerts
- **Recent Activities**: Monitor system activities in real-time
- **Floor Usage Analytics**: View occupancy by floor
- **Room Management**: Manage all campus rooms and their status

### Live Navigation (`/navigation`)
- **Blueprint Map**: Full-campus floor map with zoom controls
- **Navigation Path**: Visual route between two locations
- **Step-by-Step Directions**: Detailed navigation instructions
- **Distance & Time**: Estimated walking time and distance

## Key Features in Detail

### Campus Map
- Blueprint-style 2D floor layouts
- Color-coded rooms (green=available, red=in-use)
- Interactive room selection
- Room information panel

### Chatbot Assistant
- Predefined responses for common questions
- "How do I find a room?"
- "How do I book a classroom?"
- "Where is Block A?"
- "How do I switch floors?"

### Classroom Booking (Teachers Only)
- Select room from dropdown
- Choose date and time slot
- Set duration (1-4 hours)
- Instant confirmation

## Customization

### Color Scheme
Edit `tailwind.config.ts` to customize colors:
- **Primary**: Blue (`#2563eb`)
- **Accent**: Cyan (`#0ea5e9`)
- **Background**: Light Gray (`#f8f9fa`)

### Add New Rooms
Update room data in:
- `app/student/page.tsx`
- `app/teacher/page.tsx`

### Add Chatbot Responses
Edit `predefinedResponses` in `app/components/Chatbot.tsx`:
```typescript
const predefinedResponses: Record<string, string> = {
  'your question here': 'Your response here',
}
```

## Database Integration (Future)

This is currently a UI-only implementation. To add backend:
1. Set up a database (PostgreSQL, MongoDB, etc.)
2. Create API routes in `/api`
3. Replace mock data with real database queries
4. Implement actual user authentication

## Development Tips

- Clear browser storage: Open DevTools → Application → LocalStorage → Clear All
- Reset auth state: Use logout button in sidebar
- Test all roles: Login with different roles to see role-specific features
- Check console: Browser DevTools → Console for any errors

## Future Enhancements

- Real-time GPS-based navigation
- AR campus navigation using device camera
- Mobile app version
- Backend API with database
- Real-time notifications
- Advanced analytics dashboard
- Multi-campus support
- Room occupancy sensors integration

## License

MIT

## Support

For issues or questions, please use the **Help Desk** feature in the application or contact the development team.
