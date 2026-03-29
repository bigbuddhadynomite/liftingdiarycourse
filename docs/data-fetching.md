# Data Fetching

## RULE: Server Components Only

All data fetching in this app MUST be done exclusively via **Server Components**.

- **NEVER** fetch data in Client Components (`"use client"`)
- **NEVER** fetch data in Route Handlers (`app/api/`)
- **NEVER** use `useEffect` + `fetch` patterns
- **NEVER** use SWR, React Query, or any client-side fetching library

If you need data in a Client Component, fetch it in a Server Component parent and pass it down as props.

## RULE: Drizzle ORM via /data Helpers Only

All database queries MUST go through helper functions in the `/data` directory. These helpers MUST use Drizzle ORM — never raw SQL strings.

```
/data
  exercises.ts      # e.g. getExercisesForUser(userId)
  workouts.ts       # e.g. getWorkoutsForUser(userId)
  sets.ts           # e.g. getSetsForWorkout(userId, workoutId)
```

Each helper must accept the current user's ID and filter all queries by it. Example:

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkoutsForUser(userId: string) {
  return db.select().from(workouts).where(eq(workouts.userId, userId));
}
```

## RULE: Users Can Only Access Their Own Data

Every query MUST be scoped to the authenticated user's ID. This is a hard security requirement.

- Always get the current user's ID from the session (e.g. via `auth()`) at the Server Component level
- Always pass that ID into the `/data` helper
- The helper MUST include a `where userId = currentUserId` clause — no exceptions
- Never trust a user-supplied ID from params/query strings alone — always cross-check against the session user

```ts
// app/workouts/page.tsx (Server Component)
import { auth } from "@/auth";
import { getWorkoutsForUser } from "@/data/workouts";

export default async function WorkoutsPage() {
  const session = await auth();
  const workouts = await getWorkoutsForUser(session.user.id);
  return <WorkoutList workouts={workouts} />;
}
```

## Summary

| Approach | Allowed |
|---|---|
| Server Component calling `/data` helper | YES |
| `/data` helper using Drizzle ORM | YES |
| Route Handler fetching data | NO |
| Client Component fetching data | NO |
| Raw SQL in any file | NO |
| Query not scoped to current user | NO |
