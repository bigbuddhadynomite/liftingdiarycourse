"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1).max(255),
  performedAt: z.date(),
  notes: z.string().optional(),
});

export async function updateWorkoutAction(
  workoutId: number,
  name: string,
  performedAt: Date,
  notes?: string
) {
  const parsed = updateWorkoutSchema.safeParse({ workoutId, name, performedAt, notes });
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await updateWorkout(
    userId,
    parsed.data.workoutId,
    parsed.data.name,
    parsed.data.performedAt,
    parsed.data.notes
  );
}
