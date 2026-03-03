'use client'

import { useState } from 'react'
import { Send, X, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const predefinedResponses: Record<string, string> = {
  'how do i find a room':
    'To find a room, use the Live Navigation feature on your dashboard. Select the room from the map, and we\'ll show you step-by-step directions!',
  'how do i book a classroom':
    'As a teacher, you can book classrooms from your dashboard. Click the "Book Empty Classroom" button, select a room, date, and time slot, then confirm your booking!',
  'where is block a':
    'Block A is located on the first floor of the main campus building. You can use our Live Navigation feature to get directions there!',
  'how do i switch floors':
    'Use the Floor Switcher buttons at the top of the navigation section. Simply click on the floor number you want to view (Floor 1, 2, 3, or 4).',
  'what are your working hours':
    'Campus facilities are available 24/7 through this system. For specific building hours, please contact the admin office.',
  'how do i report an issue':
    'You can report issues through the Help Desk section in your dashboard. Describe the problem and our team will assist you shortly!',
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Campus Navigator assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')

  const findResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()

    // Check for exact or partial matches
    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (lowerMessage.includes(key.toLowerCase())) {
        return response
      }
    }

    // Default response
    return "I'm not sure about that. Try asking me about:\n• How to find a room\n• How to book a classroom\n• Where is Block A\n• How to switch floors"
  }

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: findResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 500)

    setInput('')
  }

  const handleQuickQuestion = (question: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: question,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: findResponse(question),
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 500)
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary-dark transition-all hover:scale-110 z-40 flex items-center justify-center"
          title="Open Chat Assistant"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-card-bg rounded-xl shadow-lg flex flex-col z-50 max-sm:w-[calc(100vw-2rem)] max-sm:h-[70vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary to-accent text-white rounded-t-xl">
            <div>
              <h3 className="font-bold text-lg">CampNav Assistant</h3>
              <p className="text-xs opacity-90">Always here to help</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:opacity-80 transition-opacity"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-br-none'
                      : 'bg-gray-200 text-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions - show only if chat is at initial state */}
          {messages.length === 1 && (
            <div className="px-4 py-3 border-b border-border space-y-2 max-h-32 overflow-y-auto">
              <p className="text-xs font-semibold text-text-secondary">Quick Questions:</p>
              <button
                onClick={() => handleQuickQuestion('How do I find a room?')}
                className="w-full text-left text-xs px-3 py-2 hover:bg-gray-100 rounded transition-colors text-foreground"
              >
                How do I find a room?
              </button>
              <button
                onClick={() => handleQuickQuestion('How do I book a classroom?')}
                className="w-full text-left text-xs px-3 py-2 hover:bg-gray-100 rounded transition-colors text-foreground"
              >
                How do I book a classroom?
              </button>
              <button
                onClick={() => handleQuickQuestion('Where is Block A?')}
                className="w-full text-left text-xs px-3 py-2 hover:bg-gray-100 rounded transition-colors text-foreground"
              >
                Where is Block A?
              </button>
              <button
                onClick={() => handleQuickQuestion('How do I switch floors?')}
                className="w-full text-left text-xs px-3 py-2 hover:bg-gray-100 rounded transition-colors text-foreground"
              >
                How do I switch floors?
              </button>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border bg-white rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
