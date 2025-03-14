import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Event } from "./types"

interface EventDialogsProps {
    events: Event[]
    setEvents: (events: Event[]) => void
    dialogState: {
        type: 'none' | 'add' | 'edit';
        isOpen: boolean;
        event: Event | null;
    }
    closeDialog: () => void
    selectedDate: Date
}
export function EventDialogs({
    events,
    setEvents,
    dialogState,
    closeDialog,
    selectedDate,
}: EventDialogsProps) {
    const [formData, setFormData] = React.useState({
        title: "",
        description: "",
        date: selectedDate,
        startTime: "09:00",
        endTime: "10:00",
        color: "#4285F4",
    })

    // Reset form when selected date changes and dialog is closed
    React.useEffect(() => {
        if (dialogState.type === 'none') {
            setFormData(prev => ({
                ...prev,
                date: selectedDate
            }))
        }
    }, [selectedDate, dialogState.type])

    // Set form data when editing an event
    React.useEffect(() => {
        if (dialogState.type === 'edit' && dialogState.event) {
            setFormData({
                title: dialogState.event.title,
                description: dialogState.event.description || "",
                date: dialogState.event.date,
                startTime: dialogState.event.startTime,
                endTime: dialogState.event.endTime,
                color: dialogState.event.color,
            })
        } else if (dialogState.type === 'add') {
            // Reset form for add event
            setFormData({
                title: "",
                description: "",
                date: selectedDate,
                startTime: "09:00",
                endTime: "10:00",
                color: "#4285F4",
            })
        }
    }, [dialogState, selectedDate])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleDateChange = (date: Date | undefined) => {
        if (date) setFormData((prev) => ({ ...prev, date }))
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

        // Handle add or edit based on dialog type
        if (dialogState.type === 'add') {
            // Add new event
            setEvents([...events, { ...formData, id: crypto.randomUUID() }])
        } else if (dialogState.type === 'edit' && dialogState.event) {
            // Update existing event
            setEvents(events.map(ev =>
                ev.id === dialogState.event!.id ? { ...formData, id: ev.id } : ev
            ))
        }

        closeDialog()
    }

    const colorOptions = [
        { value: "#4285F4", label: "Blue" },
        { value: "#EA4335", label: "Red" },
        { value: "#FBBC05", label: "Yellow" },
        { value: "#34A853", label: "Green" },
        { value: "#8E24AA", label: "Purple" },
    ]

    return (
        <>
            <Dialog
                open={dialogState.isOpen && dialogState.type === 'add'}
                onOpenChange={(open) => {
                    if (!open) closeDialog()
                }}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {dialogState.type === 'add' ? 'Add New Event' : 'Edit Event'}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogState.type === 'add' ? 'Create a new event on your calendar.' : 'Modify your existing event.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Event Title</label>
                            <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Add title" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Add description" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium">Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("pl-3 text-left font-normal", !formData.date && "text-muted-foreground")}>
                                            {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Color</label>
                                <Select value={formData.color} onValueChange={handleColorChange}>
                                    <SelectTrigger><SelectValue placeholder="Select a color" /></SelectTrigger>
                                    <SelectContent>
                                        {colorOptions.map((color) => (
                                            <SelectItem key={color.value} value={color.value}>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
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
                                    <Input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">End Time</label>
                                <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <Input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeDialog}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {dialogState.type === 'add' ? 'Save Event' : 'Update Event'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog
                open={dialogState.isOpen && dialogState.type === 'edit'}
                onOpenChange={(open) => {
                    if (!open) closeDialog()
                }}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                            {dialogState.type === 'add' ? 'Add New Event' : 'Edit Event'}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogState.type === 'add' ? 'Create a new event on your calendar.' : 'Modify your existing event.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Event Title</label>
                            <Input name="title" value={formData.title} onChange={handleInputChange} placeholder="Add title" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Description</label>
                            <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Add description" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="block text-sm font-medium">Date</label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className={cn("pl-3 text-left font-normal", !formData.date && "text-muted-foreground")}>
                                            {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Color</label>
                                <Select value={formData.color} onValueChange={handleColorChange}>
                                    <SelectTrigger><SelectValue placeholder="Select a color" /></SelectTrigger>
                                    <SelectContent>
                                        {colorOptions.map((color) => (
                                            <SelectItem key={color.value} value={color.value}>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }} />
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
                                    <Input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium">End Time</label>
                                <div className="flex items-center">
                                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <Input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeDialog}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                {dialogState.type === 'add' ? 'Save Event' : 'Update Event'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}