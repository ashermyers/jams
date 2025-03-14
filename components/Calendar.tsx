"use client"

import * as React from "react"
import { CalendarHeader } from "./CalendarHeader"
import { MonthView } from "./MonthView"
import { YearView } from "./YearView"
import { EventDialogs } from "./EventDialogs"
import { Event } from "./types"

export default function GoogleCalendarClone() {
    const [currentDate, setCurrentDate] = React.useState<Date>(new Date())
    const [events, setEvents] = React.useState<Event[]>([])
    // Replace separate dialog states with a single dialog control object
    const [dialogState, setDialogState] = React.useState<{
        type: 'none' | 'add' | 'edit';
        isOpen: boolean;
        event: Event | null;
    }>({
        type: 'none',
        isOpen: false,
        event: null
    })
    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
    const [viewMode, setViewMode] = React.useState<"month" | "year">("month")
    const [yearView, setYearView] = React.useState<Date>(new Date())
    const [draggedEvent, setDraggedEvent] = React.useState<Event | null>(null)

    // Helper functions to control dialog state
    const openAddEventDialog = () => {
        setDialogState({
            type: 'add',
            isOpen: true,
            event: null
        });
    };

    const openEditEventDialog = (event: Event) => {
        setDialogState({
            type: 'edit',
            isOpen: true,
            event
        });
    };

    const closeDialog = () => {
        setDialogState({
            type: 'none',
            isOpen: false,
            event: null
        });
    };

    // Derived state for backward compatibility
    const isAddEventOpen = dialogState.type === 'add' && dialogState.isOpen;
    const editEvent = {
        isOpen: dialogState.type === 'edit' && dialogState.isOpen,
        event: dialogState.event
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <CalendarHeader
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                viewMode={viewMode}
                setViewMode={setViewMode}
                yearView={yearView}
                setYearView={setYearView}
                openAddEventDialog={openAddEventDialog}
            />

            {viewMode === "month" ? (
                <MonthView
                    currentDate={currentDate}
                    events={events}
                    setEvents={setEvents}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    openAddEventDialog={openAddEventDialog}
                    openEditEventDialog={openEditEventDialog}
                    closeDialog={closeDialog}
                    draggedEvent={draggedEvent}
                    setDraggedEvent={setDraggedEvent}
                />
            ) : (
                <YearView
                    currentDate={currentDate}
                    yearView={yearView}
                    setCurrentDate={setCurrentDate}
                    setViewMode={setViewMode}
                />
            )}

            <EventDialogs
                events={events}
                setEvents={setEvents}
                dialogState={dialogState}
                closeDialog={closeDialog}
                selectedDate={selectedDate}
            />
        </div>
    )
}
