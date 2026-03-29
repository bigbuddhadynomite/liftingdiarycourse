import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq, gte, lt } from "drizzle-orm";

export async function createWorkout(
  userId: string,
  name: string,
  performedAt: Date,
  notes?: string
) {
  return db
    .insert(workouts)
    .values({ userId, name, performedAt, notes })
    .returning();
}

export async function getWorkoutById(userId: string, workoutId: number) {
  const results = await db
    .select()
    .from(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
  return results[0] ?? null;
}

export async function updateWorkout(
  userId: string,
  workoutId: number,
  name: string,
  performedAt: Date,
  notes?: string
) {
  return db
    .update(workouts)
    .set({ name, performedAt, notes: notes ?? null })
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();
}

export async function getWorkoutsForUser(userId: string, date: Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setHours(23, 59, 59, 999);

  return db
    .select()
    .from(workouts)
    .where(
      and(
        eq(workouts.userId, userId),
        gte(workouts.performedAt, start),
        lt(workouts.performedAt, end)
      )
    );
}
