"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function formatDate(date: Date): string {
  return format(date, "do MMM yyyy");
}

export function DashboardDatePicker({ selectedDate }: { selectedDate: Date }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleSelect(d: Date | undefined) {
    if (!d) return;
    setOpen(false);
    const iso = format(d, "yyyy-MM-dd");
    router.push(`/dashboard?date=${iso}`);
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">
        Showing workouts for:
      </span>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground">
          <CalendarIcon className="h-4 w-4" />
          {formatDate(selectedDate)}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
