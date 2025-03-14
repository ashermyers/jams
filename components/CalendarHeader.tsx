import * as React from "react"
import { format, addMonths, subMonths } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { YearSelector } from "./YearSelector"

interface CalendarHeaderProps {
    currentDate: Date
    setCurrentDate: (date: Date) => void
    viewMode: "month" | "year"
    setViewMode: (mode: "month" | "year") => void
    yearView: Date
    setYearView: (date: Date) => void
    openAddEventDialog: () => void
}


export function CalendarHeader({
    currentDate,
    setCurrentDate,
    viewMode,
    setViewMode,
    yearView,
    setYearView,
    openAddEventDialog,
}: CalendarHeaderProps) {
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))

    return (
        <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Calendar</h1>
                <Button onClick={openAddEventDialog} size="sm" className="gap-1">
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
                    <YearSelector
                        currentDate={currentDate}
                        yearView={yearView}
                        viewMode={viewMode}
                        setCurrentDate={setCurrentDate}
                        setYearView={setYearView}
                    />
                </div>
            </div>
        </header>
    )
}