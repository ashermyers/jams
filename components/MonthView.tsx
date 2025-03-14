import * as React from "react"
import {
    getDay,
    getDaysInMonth,
    isSameDay,
    isSameMonth,
    isToday,
    startOfMonth,
    format
} from "date-fns"
import { cn } from "@/lib/utils"
import { Event } from "./types"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"

interface MonthViewProps {
    currentDate: Date
    events: Event[]
    setEvents: (events: Event[]) => void
    selectedDate: Date
    setSelectedDate: (date: Date) => void
    openAddEventDialog: () => void
    openEditEventDialog: (event: Event) => void
    closeDialog: () => void
    draggedEvent: Event | null
    setDraggedEvent: (event: Event | null) => void
}
export function MonthView({
    currentDate,
    events,
    setEvents,
    selectedDate,
    setSelectedDate,
    openAddEventDialog,
    openEditEventDialog,
    closeDialog,
    draggedEvent,
    setDraggedEvent,
}: MonthViewProps) {
    const generateCalendarGrid = () => {
        const firstDayOfMonth = startOfMonth(currentDate)
        const startDay = getDay(firstDayOfMonth)
        const daysInMonth = getDaysInMonth(currentDate)
        const days = []
        for (let i = 0; i < startDay; i++) days.push(null)
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i))
        }
        return days
    }

    const getEventsForDate = (date: Date) => {
        return events.filter((event) => isSameDay(event.date, date))
    }

    const handleCellClick = (date: Date, e: React.MouseEvent) => {
        // Only process if the click is directly on the cell, not on a child element
        if (e.currentTarget === e.target) {
            e.preventDefault();
            e.stopPropagation();
            setSelectedDate(date);
            openAddEventDialog();
        }
    }

    const handleEventClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Context menu will handle interactions
    }

    const handleDragStart = (event: Event) => setDraggedEvent(event)

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

    const handleDrop = (date: Date) => {
        if (draggedEvent) {
            setEvents(events.map(event =>
                event.id === draggedEvent.id ? { ...event, date } : event
            ))
            setDraggedEvent(null)
        }
    }

    const handleEditEvent = (event: Event, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // First set the event to edit
        // setEditEvent({ isOpen: true, event });
        openEditEventDialog(event);

        // Ensure the add event dialog is closed
        closeDialog();
    }

    const handleDeleteEvent = (eventId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Remove the event
        setEvents(events.filter(event => event.id !== eventId));

        // Ensure dialog is closed
        closeDialog();
    }

    const renderCalendarCell = (date: Date | null, index: number) => {
        if (!date) return <div key={`empty-${index}`} className="border p-1 bg-muted/20" />

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
                onClick={(e) => handleCellClick(date, e)}
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
                            <ContextMenuTrigger asChild>
                                <div
                                    draggable
                                    onClick={handleEventClick}
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
                                <ContextMenuItem
                                    onClick={(e) => handleEditEvent(event, e as unknown as React.MouseEvent)}
                                    onSelect={(e) => {
                                        // Stop propagation to prevent further handling
                                        e.preventDefault();
                                        handleEditEvent(event, e as unknown as React.MouseEvent);
                                    }}
                                >
                                    Edit
                                </ContextMenuItem>
                                <ContextMenuItem
                                    onClick={(e) => handleDeleteEvent(event.id, e as unknown as React.MouseEvent)}
                                    onSelect={(e) => {
                                        // Stop propagation to prevent further handling
                                        e.preventDefault();
                                        handleDeleteEvent(event.id, e as unknown as React.MouseEvent);
                                    }}
                                >
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
    )
}