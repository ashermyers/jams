"use client"

import * as React from "react"
import { CalendarHeader } from "./CalendarHeader"
import { MonthView } from "./MonthView"
import { YearView } from "./YearView"
import { EventDialogs } from "./EventDialogs"
import { Event } from "./types"

export default function GoogleCalendarClone() {
    const [currentDate, setCurrentDate] = React.useState<Date>(new Date());
    const [events, setEvents] = React.useState<Event[]>([]); // Start empty to avoid SSR mismatch
    const [isMounted, setIsMounted] = React.useState(false); // Track if the component has mounted

    // Load events from localStorage after mount (Client-side only)
    React.useEffect(() => {
        setIsMounted(true); // Mark as mounted to avoid hydration mismatch
        const storedEvents = localStorage.getItem("calendarEvents");
        if (storedEvents) {
            setEvents(JSON.parse(storedEvents));
        }
    }, []);

    React.useEffect(() => {
        if (isMounted) {
            localStorage.setItem("calendarEvents", JSON.stringify(events));
        }
    }, [events, isMounted]);

    const [dialogState, setDialogState] = React.useState<{
        type: "none" | "add" | "edit";
        isOpen: boolean;
        event: Event | null;
    }>({
        type: "none",
        isOpen: false,
        event: null,
    });

    const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());
    const [viewMode, setViewMode] = React.useState<"month" | "year">("month");
    const [yearView, setYearView] = React.useState<Date>(new Date());
    const [draggedEvent, setDraggedEvent] = React.useState<Event | null>(null);

    const openAddEventDialog = () => {
        setDialogState({ type: 'add', isOpen: true, event: null });
    };

    const openEditEventDialog = (event: Event) => {
        setDialogState({ type: 'edit', isOpen: true, event });
    };

    const closeDialog = () => {
        setDialogState({ type: 'none', isOpen: false, event: null });
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
