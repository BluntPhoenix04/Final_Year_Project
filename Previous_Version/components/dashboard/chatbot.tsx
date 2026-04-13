'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, X, Send, Loader } from 'lucide-react'

/* ================================================================
   PRE-WRITTEN Q&A KNOWLEDGE BASE
   Add new entries to expand the bot's knowledge.
   Each entry has keywords to match and suggestions to show after.
   ================================================================ */

type BotEntry = {
  keywords: string[]
  response: string
  suggestions?: string[]
}

const KNOWLEDGE: BotEntry[] = [
  // Greetings
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'howdy'],
    response: "Hello! 👋 I'm CampNav AI. I can help you with navigation, your schedule, room locations, and general campus guidance. What would you like to know?",
    suggestions: ['How do I navigate to a room?', 'What floors are in the building?', 'Show my class schedule'],
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'great', 'awesome', 'perfect'],
    response: "You're welcome! 😊 Let me know if there's anything else I can help you with.",
    suggestions: ['How do I navigate?', 'Where are the labs?', 'Help me with my schedule'],
  },

  // Navigation
  {
    keywords: ['how do i navigate', 'how to navigate', 'navigate', 'find a room', 'find room', 'directions', 'get to', 'how do i get', 'go to'],
    response: "To navigate on campus:\n1. Click 'Navigator' in the sidebar\n2. In the 'From' field, type your current location (e.g. Lobby, Room 101)\n3. In the 'To' field, type your destination (e.g. 402, Lab 301)\n4. Click Visualize — the system highlights the shortest path!\n\nFor cross-floor routes, it automatically routes through the stairwells. 🗺️",
    suggestions: ['How do stairs work?', 'What floors are there?', 'Which algorithm is best?'],
  },
  {
    keywords: ['stair', 'stairs', 'stairwell', 'between floors', 'floor to floor', 'go up', 'go down', 'upper floor'],
    response: "Each floor has two staircases — one at the far LEFT end and one at the far RIGHT end of the building. They appear as amber/yellow hatched zones labeled 'L Stairs' and 'R Stairs'.\n\nWhen the path crosses floors, the algorithm routes through these automatically. After finding a path, switch floors using the F1/F2/F3/F4 buttons — orange dots (🔶) show which floors have path segments. 🪜",
    suggestions: ['How do I navigate?', 'What if my source is on Floor 1 and target is Floor 4?'],
  },
  {
    keywords: ['source', 'from', 'start', 'starting point', 'origin', 'starting location'],
    response: "In the Navigator, the 'From (Source)' panel at the top-left lets you set your starting location.\n\nType any room name or number (e.g. 'Lobby', '101', 'Lab 301') and select it from the dropdown. A green START marker will appear on the map. 📍",
    suggestions: ['How do I set the destination?', 'What is the default starting point?'],
  },
  {
    keywords: ['destination', 'target', 'end', 'to', 'endpoint', 'where i want to go'],
    response: "In the Navigator, the 'To (Target)' panel lets you set your destination.\n\nType a room number like '402', '204', or 'Seminar Hall', then select it. A red END marker appears on the map. Then click Visualize to find the path! 🎯",
    suggestions: ['How do I visualize the path?', 'Can I navigate across floors?'],
  },
  {
    keywords: ['visualize', 'visualisation', 'visualization', 'start navigation', 'run', 'find path', 'pathfind'],
    response: "Once you've set your From and To locations, click the Visualize button.\n\nYou'll see:\n• 🟣 Purple cells = nodes explored by the algorithm\n• 🟡 Yellow/white path = the actual shortest route found\n• 🔶 Orange dots on floor buttons = the route passes through that floor\n\nSwitch floors to trace the full multi-floor path!",
    suggestions: ['Which algorithm is fastest?', 'How do I switch floors?'],
  },
  {
    keywords: ['switch floor', 'change floor', 'view floor', 'floor button', 'f1', 'f2', 'f3', 'f4', 'floor view'],
    response: "Use the F1 / F2 / F3 / F4 buttons in the 'Floor View' card on the left sidebar to switch between floors.\n\nImportant: Switching floors does NOT reset your path — the visualized route stays intact so you can inspect each floor's segment. 🏢\n\nA 🔶 orange dot on a floor button means the path passes through that floor.",
    suggestions: ['How do I navigate cross-floor?', 'Where are the stairs?'],
  },

  // Algorithms
  {
    keywords: ['algorithm', 'astar', 'a*', 'dijkstra', 'bfs', 'dfs', 'which algorithm'],
    response: "The Navigator supports 4 pathfinding algorithms:\n\n⭐ A* (recommended) — Fastest & optimal, uses smart heuristics\n📍 Dijkstra's — Guaranteed shortest path, explores evenly\n🔀 BFS — Explores level by level, good for unweighted paths\n🌀 DFS — Deep-first exploration, not always optimal\n\nSelect one in the Algorithm dropdown in the sidebar before clicking Visualize.",
    suggestions: ['Which is best for cross-floor?', 'What does the visualisation show?'],
  },
  {
    keywords: ['best algorithm', 'recommend', 'fastest', 'optimal', 'which should i use'],
    response: "For campus navigation, A* (A-Star) is the recommended algorithm. It finds the shortest path efficiently by using a heuristic that guides the search toward the destination — so it explores far fewer dead-end cells than Dijkstra's or BFS. ⭐",
    suggestions: ['How do I change algorithm?', 'How do I visualize?'],
  },

  // Floors & Rooms
  {
    keywords: ['floor', 'floors', 'how many floors', 'building'],
    response: "The campus building has 4 floors:\n\n🏢 Floor 1 — Main Entrance, Lobby, Dean's Office, Admin Offices (Rooms 101–118)\n🏫 Floor 2 — Classrooms, Prof. Clarke & Lincoln offices (Rooms 201–218)\n🔬 Floor 3 — Labs, Seminar Hall, Conference Room (Rooms 301–318)\n🎓 Floor 4 — Faculty Offices, Research Lab, Study Hall (Rooms 401–418)",
    suggestions: ['Where is the lobby?', 'Where are the labs?', 'Navigate to Floor 4'],
  },
  {
    keywords: ['lobby', 'main lobby', 'entrance', 'main entrance', '110'],
    response: "The Main Lobby (Room 110) is on Floor 1, in the central section of the building between the left and right wings.\n\nIt's the default starting point for Floor 1 navigation. 🚪",
    suggestions: ['How do I navigate from the Lobby?', "Where is the Dean's Office?"],
  },
  {
    keywords: ["dean", "dean's office", '109'],
    response: "The Dean's Office (Room 109) is on Floor 1, in the central-top area directly above the Main Lobby. 🧑‍💼",
    suggestions: ['Navigate to Dean\'s Office', 'What else is on Floor 1?'],
  },
  {
    keywords: ['lab', 'laboratory', 'labs', '301', '302', '305', '306', '313', '314', '317'],
    response: "Labs are primarily on Floor 3:\n• Lab 301, 302 — Left wing, top\n• Lab 305, 306 — Left wing, bottom\n• Lab 313, 314 — Right wing, top\n• Lab 317 — Right wing, bottom\n• Research Lab 409 — Floor 4, central\n\nServer Room 318 is also on Floor 3. 🔬",
    suggestions: ['Navigate to Lab 301', 'What is on Floor 3?'],
  },
  {
    keywords: ['seminar', 'seminar hall', '309'],
    response: "The Seminar Hall (Room 309) is on Floor 3, in the central-top area. It's a large space for presentations and group sessions. 📢",
    suggestions: ['How do I navigate to Seminar Hall?', 'What else is on Floor 3?'],
  },
  {
    keywords: ['research lab', '409'],
    response: "The Research Lab (Room 409) is on Floor 4, central-top. Used for advanced research projects. 🧪",
    suggestions: ['Navigate to Research Lab', 'What is on Floor 4?'],
  },
  {
    keywords: ['study hall', '410'],
    response: "The Study Hall (Room 410) is on Floor 4, central-bottom. A quiet zone for individual or group study. 📚",
    suggestions: ['Navigate to Study Hall', 'What else is on Floor 4?'],
  },
  {
    keywords: ['registrar', '117', '214'],
    response: "The Registrar's Office has two locations:\n• Room 117 on Floor 1 (bottom-right wing)\n• Room 214 on Floor 2 (top-right, 'Registrar's House')\n\nVisit for transcripts, enrollment, and academic records. 📋",
    suggestions: ['Navigate to Room 117', 'Navigate to Room 214'],
  },

  // Schedule
  {
    keywords: ['schedule', 'timetable', 'my classes', 'class', 'classes', 'today', 'lecture', 'course'],
    response: "Your class schedule is in the Schedule section (sidebar).\n\nEach class entry shows:\n• Subject name & code\n• Instructor name\n• Time slot & room\n• A 'Navigate to Room' button that opens the Navigator pre-set to that classroom 📅",
    suggestions: ['How does Navigate to Room work?', 'Show me CS101 details'],
  },
  {
    keywords: ['cs101', 'computer science', 'intro cs', 'dr smith'],
    response: "Introduction to Computer Science (CS101)\n📍 Room 101, Floor 1\n👨‍🏫 Dr. Smith\n🕐 Monday 09:00 – 10:30",
    suggestions: ['Navigate to Room 101', 'Show me my full schedule'],
  },
  {
    keywords: ['math201', 'calculus', 'maths', 'prof johnson'],
    response: "Calculus II (MATH201)\n📍 Room 204, Floor 2\n👨‍🏫 Prof. Johnson\n🕐 Monday 11:00 – 12:30",
    suggestions: ['Navigate to Room 204', 'Show me my full schedule'],
  },
  {
    keywords: ['eng102', 'english', 'literature', 'dr williams'],
    response: "Seminar: Literature & Composition (ENG102)\n📍 Seminar Hall (Room 309), Floor 3\n👨‍🏫 Dr. Williams\n🕐 Tuesday 14:00 – 15:30",
    suggestions: ['Navigate to Seminar Hall', 'Show me my full schedule'],
  },
  {
    keywords: ['phys301', 'physics', 'physics lab', 'prof brown'],
    response: "Modern Physics Lab (PHYS301)\n📍 Lab 301, Floor 3\n👨‍🏫 Prof. Brown\n🕐 Wednesday 13:00 – 14:30",
    suggestions: ['Navigate to Lab 301', 'Show me my full schedule'],
  },
  {
    keywords: ['cs405', 'advanced ai', 'alan turing', 'ai research', 'machine learning'],
    response: "Advanced AI Research (CS405)\n📍 Research Lab (Room 409), Floor 4\n👨‍🏫 Dr. Alan Turing\n🕐 Thursday 10:00 – 12:00",
    suggestions: ['Navigate to Research Lab', 'Show me my full schedule'],
  },

  // Dashboard & website features
  {
    keywords: ['dashboard', 'home', 'main page', 'overview'],
    response: "The Dashboard is your home screen. It shows:\n• Available Rooms count\n• Today's Classes count\n• Your Role (student/staff)\n• Explore Rooms tab — browse & navigate to study spaces\n• My Classes tab — quick access to today's schedule with Navigate buttons 🏠",
    suggestions: ['How do I navigate from My Classes?', 'What other sections are there?'],
  },
  {
    keywords: ['sidebar', 'menu', 'sections', 'pages', 'features', 'website', 'what can i do'],
    response: "CampNav has these main sections:\n\n🏠 Dashboard — Overview, explore rooms, today's classes\n🗺️ Navigator — Interactive pathfinding across all 4 floors\n📅 Schedule — Your weekly class timetable\n🤖 Help Desk — This AI assistant & support tickets\n⚙️ Settings — Account preferences",
    suggestions: ['How do I use the Navigator?', 'Show me the schedule info'],
  },
  {
    keywords: ['settings', 'account', 'profile', 'preferences'],
    response: "The Settings page lets you configure your account preferences — theme, notifications, and profile info. Access it from the bottom of the sidebar. ⚙️",
    suggestions: ['What other sections are there?', 'How do I navigate?'],
  },
  {
    keywords: ['help', 'what can you do', 'how can you help', 'capabilities', 'assist'],
    response: "I'm CampNav AI! 🤖 I can help you with:\n\n🗺️ Navigation — How to use the pathfinding system\n🏢 Rooms — Find any room on any floor\n📅 Schedule — Class times, rooms, instructors\n🔬 Algorithms — How A*, Dijkstra's, BFS and DFS work\n🏛️ Facilities — Labs, offices, cafeteria, gym\n\nJust ask!",
    suggestions: ['How do I navigate?', 'What floors are there?', 'Tell me about the schedule'],
  },

  // Facilities
  {
    keywords: ['cafeteria', 'food', 'eat', 'dining', 'canteen'],
    response: "The Main Cafeteria is in the Student Center, Floor 1. Open 7:00 AM – 10:00 PM daily. 🍽️",
    suggestions: ['What other facilities are there?', 'How do I navigate?'],
  },
  {
    keywords: ['gym', 'sports', 'exercise', 'fitness', 'sports complex'],
    response: "The Sports Complex (Gym) is in the Student Center, Floor 2. Open 6:00 AM – 11:00 PM. 🏋️",
    suggestions: ['What other facilities are there?'],
  },
  {
    keywords: ['health', 'medical', 'doctor', 'nurse', 'sick', 'health center'],
    response: "The Health Center is in the Library Building, Floor 1. Open 8:00 AM – 6:00 PM. For emergencies, contact campus security immediately. 🏥",
    suggestions: ['What other facilities are there?'],
  },
  {
    keywords: ['wifi', 'internet', 'network', 'connection', 'password', 'login'],
    response: "Campus Wi-Fi: Connect to CampusNet and log in with your student credentials.\n\nFor login or password issues, contact the IT Help Desk at support@campus.edu or submit a ticket below. 📶",
    suggestions: ['How do I submit a ticket?'],
  },
  {
    keywords: ['ticket', 'support', 'issue', 'problem', 'report', 'submit'],
    response: "To submit a support ticket, scroll down on this Help Desk page. Fill in:\n• Category (Navigation, Facilities, Technical, etc.)\n• Subject — brief description\n• Message — full details\n\nClick Submit Ticket and our team will respond shortly. 🎫",
    suggestions: ['What categories can I report?'],
  },
]

/* ── Bot engine ── */
function getBotEntry(input: string): BotEntry {
  const lower = input.toLowerCase().trim()
  let best: BotEntry | null = null
  let maxScore = 0

  for (const entry of KNOWLEDGE) {
    let score = 0
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) score += kw.length
    }
    if (score > maxScore) { maxScore = score; best = entry }
  }

  if (best && maxScore > 0) return best

  return {
    response: "Hmm, I'm not sure about that. Here are some things I can help with:",
    suggestions: ['How do I navigate?', 'What floors are there?', 'Show my class schedule', 'What can you do?'],
  }
}

/* ── Initial suggestions shown before first user message ── */
const INITIAL_SUGGESTIONS = [
  'How do I navigate to a room?',
  'What floors are in the building?',
  'Show my class schedule',
  'Where are the labs?',
  'Which algorithm is best?',
  'What sections does the website have?',
]

/* ── Types ── */
interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  suggestions?: string[]
  timestamp: Date
}

/* ── Component ── */
export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'bot',
      content: "Hello! I'm CampNav AI. How can I help you navigate campus today?",
      suggestions: INITIAL_SUGGESTIONS.slice(0, 3),
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = (text: string) => {
    if (!text.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    setTimeout(() => {
      const entry = getBotEntry(text)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: entry.response,
        suggestions: entry.suggestions,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 500 + Math.random() * 300)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all z-40"
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl flex flex-col z-40 bg-card border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          <h3 className="font-semibold">CampNav AI Assistant</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-primary-foreground/20 rounded transition-colors"
          aria-label="Close chatbot"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map(message => (
            <div key={message.id}>
              <div className={cn('flex', message.type === 'user' ? 'justify-end' : 'justify-start')}>
                <div
                  className={cn(
                    'max-w-xs px-4 py-2 rounded-lg',
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-secondary text-foreground rounded-bl-none'
                  )}
                >
                  {/* Render newlines */}
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Suggestion chips — only for bot messages */}
              {message.type === 'bot' && message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 pl-1">
                  {message.suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      disabled={isLoading}
                      className="text-xs px-2.5 py-1 rounded-full bg-primary/8 border border-primary/25 text-primary hover:bg-primary/15 transition-all disabled:opacity-40"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-secondary text-foreground px-4 py-2 rounded-lg rounded-bl-none flex items-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card rounded-b-lg flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
          className="bg-secondary"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading || !inputValue.trim()}
          className="flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </Card>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
