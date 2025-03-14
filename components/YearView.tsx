import * as React from "react"
import { format, getDay, getDaysInMonth, isToday, setMonth } from "date-fns"
import { cn } from "@/lib/utils"

interface YearViewProps {
    yearView: Date
    currentDate: Date
    setCurrentDate: (date: Date) => void
    setViewMode: (mode: "month" | "year") => void
}

export function YearView({ yearView, currentDate, setCurrentDate, setViewMode }: YearViewProps) {
    const generateYearGrid = () => {
        return Array.from({ length: 12 }, (_, i) => new Date(yearView.getFullYear(), i, 1))
    }

    const handleMonthSelect = (month: number) => {
        setCurrentDate(setMonth(currentDate, month))
        setViewMode("month")
    }

    return (
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
    )
}