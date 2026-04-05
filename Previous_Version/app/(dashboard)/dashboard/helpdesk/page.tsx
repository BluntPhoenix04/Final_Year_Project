'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { helpDeskCategories } from '@/lib/mock-data'
import { MessageSquare, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function HelpdeskPage() {
  const [selectedCategory, setSelectedCategory] = useState('general')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [tickets, setTickets] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject || !message) return

    setIsSubmitting(true)
    setTimeout(() => {
      setTickets([
        {
          id: `ticket-${Date.now()}`,
          subject,
          message,
          category: selectedCategory,
          status: 'open',
          createdAt: new Date(),
          priority: 'normal',
        },
        ...tickets,
      ])
      setSubject('')
      setMessage('')
      setIsSubmitting(false)
    }, 600)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-blue-100 text-blue-700">Open</Badge>
      case 'in-progress':
        return <Badge className="bg-orange-100 text-orange-700">In Progress</Badge>
      case 'resolved':
        return <Badge className="bg-green-100 text-green-700">Resolved</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-blue-600" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-orange-600" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <MessageSquare className="w-4 h-4" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Smart Help Desk</h1>
          <p className="text-muted-foreground">Get AI-powered assistance and track your support tickets</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submit Ticket Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submit a Support Request</CardTitle>
                <CardDescription>Tell us how we can help you navigate campus</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {helpDeskCategories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={cn(
                            'p-2 rounded-lg border-2 transition-all text-sm text-center',
                            selectedCategory === cat.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          )}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                    <Input
                      id="subject"
                      placeholder="Brief description of your issue..."
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <Textarea
                      id="message"
                      placeholder="Provide more details about your question or issue..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={5}
                      disabled={isSubmitting}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !subject || !message}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">How do I navigate to a classroom?</h4>
                    <p className="text-sm text-muted-foreground">
                      Go to the Navigate section, search for your classroom, and follow the real-time directions.
                    </p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">Can I book a study room in advance?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can book available rooms up to 2 weeks in advance from the Rooms section.
                    </p>
                  </div>
                  <div className="p-3 border border-border rounded-lg">
                    <h4 className="font-medium text-foreground mb-1">What's included in campus facilities?</h4>
                    <p className="text-sm text-muted-foreground">
                      We have cafeterias, gyms, health centers, libraries, and study spaces. Check our facilities map for details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* My Tickets */}
          <div>
            <Card className="sticky top-0">
              <CardHeader>
                <CardTitle className="text-lg">Your Tickets</CardTitle>
                <CardDescription>Recent support requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-muted-foreground">No tickets yet</p>
                  </div>
                ) : (
                  tickets.map(ticket => (
                    <div key={ticket.id} className="p-3 border border-border rounded-lg space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1">
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {ticket.subject}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {ticket.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          {getStatusIcon(ticket.status)}
                        </div>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
