import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkoutsForUser } from "@/data/workouts";
import { DashboardDatePicker } from "./date-picker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  const { date: dateParam } = await searchParams;

  const date = dateParam
    ? (() => {
        const [y, m, d] = dateParam.split("-").map(Number);
        return new Date(y, m - 1, d);
      })()
    : new Date();
  const workouts = userId ? await getWorkoutsForUser(userId, date) : [];

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <DashboardDatePicker selectedDate={date} />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Workouts logged</h2>

        {workouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No workouts logged for this date.
          </p>
        ) : (
          <div className="space-y-2">
            {workouts.map((workout) => (
              <Link key={workout.id} href={`/dashboard/workout/${workout.id}`}>
                <Card className="hover:bg-accent transition-colors cursor-pointer">
                  <CardHeader className="pb-1 pt-4 px-4">
                    <CardTitle className="text-base">
                      {workout.name ?? "Untitled Workout"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4 px-4">
                    {workout.notes && (
                      <p className="text-sm text-muted-foreground">
                        {workout.notes}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
