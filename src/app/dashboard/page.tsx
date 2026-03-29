"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function formatDate(date: Date): string {
  return format(date, "do MMM yyyy");
}

// Placeholder workout data — replace with real data fetching later
const PLACEHOLDER_WORKOUTS = [
  { id: 1, name: "Squat", sets: 3, reps: 5, weight: 100 },
  { id: 2, name: "Bench Press", sets: 3, reps: 5, weight: 80 },
  { id: 3, name: "Deadlift", sets: 1, reps: 5, weight: 140 },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">
          Showing workouts for:
        </span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm hover:bg-accent hover:text-accent-foreground">
            <CalendarIcon className="h-4 w-4" />
            {formatDate(date)}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d);
                  setOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Workouts logged</h2>

        {PLACEHOLDER_WORKOUTS.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No workouts logged for this date.
          </p>
        ) : (
          <div className="space-y-2">
            {PLACEHOLDER_WORKOUTS.map((workout) => (
              <Card key={workout.id}>
                <CardHeader className="pb-1 pt-4 px-4">
                  <CardTitle className="text-base">{workout.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-4 px-4">
                  <p className="text-sm text-muted-foreground">
                    {workout.sets} sets &times; {workout.reps} reps @ {workout.weight} kg
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
