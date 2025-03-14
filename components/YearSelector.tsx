import * as React from "react"
import { setYear } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface YearSelectorProps {
    currentDate: Date
    yearView: Date
    viewMode: "month" | "year"
    setCurrentDate: (date: Date) => void
    setYearView: (date: Date) => void
}

export function YearSelector({ currentDate, yearView, viewMode, setCurrentDate, setYearView }: YearSelectorProps) {
    const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i)

    const handleYearChange = (year: number) => {
        if (viewMode === "year") {
            setYearView(setYear(yearView, year))
        } else {
            setCurrentDate(setYear(currentDate, year))
        }
    }

    return (
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
    )
}