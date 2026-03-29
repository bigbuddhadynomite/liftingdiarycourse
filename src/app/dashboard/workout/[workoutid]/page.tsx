import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import EditWorkoutForm from "./edit-workout-form";

interface Props {
  params: Promise<{ workoutid: string }>;
}

export default async function EditWorkoutPage({ params }: Props) {
  const { workoutid } = await params;
  const workoutId = parseInt(workoutid, 10);

  if (isNaN(workoutId)) {
    notFound();
  }

  const { userId } = await auth();
  if (!userId) {
    notFound();
  }

  const workout = await getWorkoutById(userId, workoutId);
  if (!workout) {
    notFound();
  }

  return <EditWorkoutForm workout={workout} />;
}
