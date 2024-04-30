import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

interface DateControlProps {
  selectedDate: Date;
  onDateChanged: (date: Date) => void;
}

export function DateControl({ selectedDate, onDateChanged }: DateControlProps) {
  const [isOpen, setIsOpen] = useState(false);

const handleSelect = (date: Date | undefined) => {
  if (date) {
    onDateChanged(date);
    setIsOpen(false); // Close the popover on date selection
  }
};

  return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="w-48">
            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
  );
}
