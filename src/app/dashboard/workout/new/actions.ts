"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  performedAt: z.date(),
  notes: z.string().optional(),
});

export async function createWorkoutAction(
  name: string,
  performedAt: Date,
  notes?: string
) {
  const parsed = createWorkoutSchema.safeParse({ name, performedAt, notes });
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  await createWorkout(
    userId,
    parsed.data.name,
    parsed.data.performedAt,
    parsed.data.notes
  );
}
