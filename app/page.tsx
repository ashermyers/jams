"use client"

import * as React from "react"
import {
  addMonths,
  format,
  getDay,
  getDaysInMonth,
  isSameDay,
  isSameMonth,
  isToday,
  setMonth,
  setYear,
  startOfMonth,
  subMonths,
} from "date-fns"
import { CalendarIcon, ChevronLeft, ChevronRight, Clock, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AuroraBackground } from "@/components/ui/aurora-background"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

interface Event {
  id: string
  title: string
  description?: string
  date: Date
  startTime: string
  endTime: string
  color: string
}

interface EditEventState {
  isOpen: boolean
  event: Event | null
}

export default function GoogleCalendarClone() {
  const [currentDate, setCurrentDate] = React.useState<Date>(new Date())
  const [events, setEvents] = React.useState<Event[]>([])
  const [isAddEventOpen, setIsAddEventOpen] = React.useState(false)
  const [editEvent, setEditEvent] = React.useState<EditEventState>({ isOpen: false, event: null })
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [viewMode, setViewMode] = React.useState<"month" | "year">("month")
  const [yearView, setYearView] = React.useState<Date>(new Date())
  const [draggedEvent, setDraggedEvent] = React.useState<Event | null>(null)

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    date: new Date(),
    startTime: "09:00",
    endTime: "10:00",
    color: "#4285F4",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }))
    }
  }

  const handleColorChange = (value: string) => {
    setFormData((prev) => ({ ...prev, color: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.startTime || !formData.endTime) {
      alert("Title and times are required")
      return
    }
    
    setEvents([...events, { ...formData, id: crypto.randomUUID() }])
    setIsAddEventOpen(false)
    resetForm()
  }

  const handleEditEvent = (event: Event) => {
    // Prevent Add Event dialog from opening
    setIsAddEventOpen(false)
    setEditEvent({ isOpen: true, event })
    setFormData({
      title: event.title,
      description: event.description || "",
      date: event.date,
      startTime: event.startTime,
      endTime: event.endTime,
      color: event.color,
    })
  }

  const handleUpdateEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editEvent.event) return
    
    setEvents(events.map(ev => 
      ev.id === editEvent.event!.id ? { ...formData, id: ev.id } : ev
    ))
    setEditEvent({ isOpen: false, event: null })
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: selectedDate,
      startTime: "09:00",
      endTime: "10:00",
      color: "#4285F4",
    })
  }

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId))
  }

  const handleDragStart = (event: Event) => {
    setDraggedEvent(event)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (date: Date) => {
    if (draggedEvent) {
      setEvents(events.map(event => 
        event.id === draggedEvent.id ? { ...event, date } : event
      ))
      setDraggedEvent(null)
    }
  }

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleDateSelect = (date: Date, e: React.MouseEvent) => {
    // Prevent opening Add Event dialog when clicking an event
    if ((e.target as HTMLElement).closest('.event-item')) {
      return
    }
    setSelectedDate(date)
    setFormData((prev) => ({ ...prev, date }))
    setIsAddEventOpen(true)
  }

  const handleMonthSelect = (month: number) => {
    setCurrentDate(setMonth(currentDate, month))
    setViewMode("month")
  }

  const handleYearChange = (year: number) => {
    if (viewMode === "year") {
      setYearView(setYear(yearView, year))
    } else {
      setCurrentDate(setYear(currentDate, year))
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date))
  }

  const generateCalendarGrid = () => {
    const firstDayOfMonth = startOfMonth(currentDate)
    const startDay = getDay(firstDayOfMonth)
    const daysInMonth = getDaysInMonth(currentDate)

    const days = []
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
      days.push(date)
    }
    return days
  }

  const generateYearGrid = () => {
    const months = []
    for (let i = 0; i < 12; i++) {
      months.push(new Date(yearView.getFullYear(), i, 1))
    }
    return months
  }

  const colorOptions = [
    { value: "#4285F4", label: "Blue" },
    { value: "#EA4335", label: "Red" },
    { value: "#FBBC05", label: "Yellow" },
    { value: "#34A853", label: "Green" },
    { value: "#8E24AA", label: "Purple" },
  ]

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i)

  const renderCalendarCell = (date: Date | null, index: number) => {
    if (!date) {
      return <div key={`empty-${index}`} className="border p-1 bg-muted/20" />
    }
    
    const dateEvents = getEventsForDate(date)
    const isCurrentMonth = isSameMonth(date, currentDate)

    return (
      <div
        key={date.toString()}
        className={cn(
          "border p-1 min-h-[100px] relative",
          !isCurrentMonth && "bg-muted/20",
          isToday(date) && "bg-blue-50"
        )}
        onClick={(e) => handleDateSelect(date, e)}
        onDragOver={handleDragOver}
        onDrop={() => handleDrop(date)}
      >
        <div
          className={cn(
            "text-sm font-medium h-6 w-6 flex items-center justify-center rounded-full",
            isToday(date) && "bg-blue-600 text-white"
          )}
        >
          {format(date, "d")}
        </div>
        <div className="mt-1 space-y-1 max-h-[calc(100%-24px)] overflow-y-auto">
          {dateEvents.map((event) => (
            <ContextMenu key={event.id}>
              <ContextMenuTrigger>
                <div
                  draggable
                  onDragStart={() => handleDragStart(event)}
                  className="event-item text-xs p-1 rounded truncate cursor-move"
                  style={{ 
                    backgroundColor: `${event.color}20`, 
                    borderLeft: `3px solid ${event.color}` 
                  }}
                >
                  {event.startTime} - {event.title}
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => handleEditEvent(event)}>
                  Edit
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleDeleteEvent(event.id)}>
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </div>
    )
  }

  return (
      <div className="container mx-auto p-4 max-w-7xl">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Calendar</h1>
            <Button onClick={() => setIsAddEventOpen(true)} size="sm" className="gap-1">
              <Plus className="h-4 w-4" />
              Create
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Today
            </Button>
            <div className="flex">
              <Button variant="ghost" size="icon" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <h2
                className="text-xl font-semibold cursor-pointer"
                onClick={() => setViewMode(viewMode === "month" ? "year" : "month")}
              >
                {viewMode === "month" ? format(currentDate, "MMMM yyyy") : format(yearView, "yyyy")}
              </h2>
              <Select
                value={viewMode === "month" ? currentDate.getFullYear().toString() : yearView.getFullYear().toString()}
                onValueChange={(value) => handleYearChange(Number.parseInt(value))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        {viewMode === "month" ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-7 border-b">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 h-[calc(100vh-200px)]">
              {generateCalendarGrid().map((date, index) => renderCalendarCell(date, index))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {generateYearGrid().map((month) => (
              <div
                key={month.toString()}
                className="border rounded-lg p-4 cursor-pointer hover:bg-blue-50"
                onClick={() => handleMonthSelect(month.getMonth())}
              >
                <h3 className="text-center font-medium mb-2">{format(month, "MMMM")}</h3>
                <div className="grid grid-cols-7 gap-1">
                  {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
                    <div key={day} className="text-[10px] text-center text-muted-foreground">
                      {day}
                    </div>
                  ))}
                  {Array.from({ length: getDay(month) }).map((_, i) => (
                    <div key={`empty-${i}`} className="w-5 h-5" />
                  ))}
                  {Array.from({ length: getDaysInMonth(month) }).map((_, i) => {
                    const date = new Date(month.getFullYear(), month.getMonth(), i + 1)
                    return (
                      <div
                        key={i}
                        className={cn(
                          "w-5 h-5 text-[10px] flex items-center justify-center rounded-full",
                          isToday(date) && "bg-blue-600 text-white"
                        )}
                      >
                        {i + 1}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
              <DialogDescription>Create a new event on your calendar.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Event Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Add title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium">Color</label>
                  <Select value={formData.color} onValueChange={handleColorChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color.value }}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Start Time</label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">End Time</label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddEventOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Event</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={editEvent.isOpen} onOpenChange={(open) => setEditEvent({ ...editEvent, isOpen: open })}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
              <DialogDescription>Modify your existing event.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Event Title</label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Add title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Add description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="block text-sm font-medium">Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <label className="block text-sm font-medium">Color</label>
                  <Select value={formData.color} onValueChange={handleColorChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {colorOptions.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: color.value }}
                            />
                            {color.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Start Time</label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">End Time</label>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditEvent({ isOpen: false, event: null })}>
                  Cancel
                </Button>
                <Button type="submit">Update Event</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
  )
}