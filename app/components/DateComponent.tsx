"use client"

import * as React from "react"
import { addDays, format, isAfter, startOfToday } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select } from "@/components/ui/select"

export function DatePickerWithPresets() {
  const [date, setDate] = React.useState<Date>()

  // Handle date selection
  const handleDateSelect = (selectedDate:any) => {
    if (isAfter(selectedDate, startOfToday())) {
      // If the selected date is in the future, do not update the date
      return;
    }
    setDate(selectedDate);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) =>
            handleDateSelect(addDays(new Date(), parseInt(value)))
          }
        >
          {/* Options for Select */}
        </Select>
        <div className="rounded-md border">
          <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
        </div>
      </PopoverContent>
    </Popover>
  )
}
