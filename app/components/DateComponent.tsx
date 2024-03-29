"use client";

import * as React from "react";
import { addDays, format, isAfter, isBefore, startOfToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Select } from "@/components/ui/select";

type DatePickerWithPresetsProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
};

export function DatePickerWithPresets({
  selectedDate,
  setSelectedDate,
}: DatePickerWithPresetsProps) {
  // Initialize date state to today's date
   const [date, setDate] = React.useState<Date>(startOfToday())
  const disableBefore2024 = new Date(2024, 0, 1); // January 1st, 2024
  const [error, setError] = React.useState<string>("");

  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      // Handle the case where the date is undefined
      return;
    }
    const tomorrow = addDays(startOfToday(), 1); // Get tomorrow's date

    if (isBefore(newDate, disableBefore2024)) {
      setError("Date cannot be before January 1, 2024.");
      return;
    }
    if (isAfter(newDate, tomorrow)) {
      setError("Date cannot be after today.");
      return;
    }

    setError("");
    setSelectedDate(newDate); // Now this is safe as date is confirmed to be a Date object
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span>Pick a date</span>
          )}
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
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            fromMonth={disableBefore2024}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
