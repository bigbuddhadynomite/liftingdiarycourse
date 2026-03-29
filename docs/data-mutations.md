# Data Mutations

## RULE: Mutations Go Through /data Helpers

All database mutations (insert, update, delete) MUST go through helper functions in the `src/data/` directory. These helpers MUST use Drizzle ORM — never raw SQL strings.

```
src/data/
  exercises.ts      # e.g. createExercise(), updateExercise(), deleteExercise()
  workouts.ts       # e.g. createWorkout(), updateWorkout(), deleteWorkout()
  sets.ts           # e.g. createSet(), updateSet(), deleteSet()
```

Each mutation helper must accept the current user's ID and scope all operations to it. Example:

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function deleteWorkout(userId: string, workoutId: string) {
  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)));
}

export async function createWorkout(userId: string, name: string, date: Date) {
  return db.insert(workouts).values({ userId, name, date }).returning();
}
```

- **NEVER** call `db` directly from a Server Action or component
- **NEVER** use raw SQL strings
- Every mutation helper MUST scope the operation to `userId` — no exceptions

## RULE: Server Actions via Colocated actions.ts Files

All Server Actions MUST be defined in colocated `actions.ts` files, placed alongside the route or component they serve.

```
src/app/workouts/
  page.tsx
  actions.ts        ← Server Actions for this route

src/app/workouts/[id]/
  page.tsx
  actions.ts        ← Server Actions for this route
```

- **NEVER** define Server Actions inline in component files
- **NEVER** define Server Actions in a global/shared actions file unless the action is genuinely shared across multiple unrelated routes

## RULE: Typed Parameters — No FormData

All Server Action parameters MUST be explicitly typed. `FormData` is **prohibited** as a parameter type.

```ts
// ✅ CORRECT — typed parameters
export async function createWorkout(name: string, date: Date) { ... }

// ✅ CORRECT — typed object parameter
export async function updateSet(params: { setId: string; reps: number; weight: number }) { ... }

// ❌ WRONG — FormData is not allowed
export async function createWorkout(formData: FormData) { ... }
```

## RULE: Validate All Arguments with Zod

Every Server Action MUST validate its arguments with Zod before performing any operation.

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1).max(100),
  date: z.date(),
});

export async function createWorkoutAction(name: string, date: Date) {
  const parsed = createWorkoutSchema.safeParse({ name, date });
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const session = await auth();
  return createWorkout(session.user.id, parsed.data.name, parsed.data.date);
}
```

- Define the Zod schema at the top of the file, co-located with its action
- Use `safeParse` and handle the failure case explicitly
- Never pass raw, unvalidated arguments to a `/data` helper

## RULE: Users Can Only Mutate Their Own Data

Every mutation MUST be scoped to the authenticated user's ID. The user's ID MUST come from the session — never from user-supplied input.

- Always call `auth()` inside the Server Action to get the current user's ID
- Always pass that ID into the `/data` mutation helper
- The `/data` helper MUST include a `where userId = currentUserId` clause on all updates and deletes

## RULE: No Redirects Inside Server Actions

Do **not** call `redirect()` from `next/navigation` inside a Server Action. Instead, return from the action and perform the redirect client-side after the call resolves.

```ts
// ❌ WRONG — redirect inside a Server Action
export async function createWorkoutAction(name: string, date: Date) {
  // ...
  redirect("/dashboard");
}

// ✅ CORRECT — action returns, client redirects
export async function createWorkoutAction(name: string, date: Date) {
  // ...
  // just return; caller handles navigation
}
```

Client-side redirect after the action resolves:

```ts
"use client";
import { useRouter } from "next/navigation";

const router = useRouter();

async function handleSubmit() {
  await createWorkoutAction(name, date);
  router.push("/dashboard");
}
```

## Summary

| Approach | Allowed |
|---|---|
| Server Action calling `/data` helper | YES |
| `/data` helper using Drizzle ORM | YES |
| Zod validation on all Server Action args | YES (required) |
| Typed parameters on Server Actions | YES (required) |
| Client-side redirect after Server Action resolves | YES (required) |
| `FormData` as a Server Action parameter | NO |
| `db` called directly from a Server Action | NO |
| Server Action defined outside `actions.ts` | NO |
| Mutation not scoped to current user | NO |
| Raw SQL in any file | NO |
| `redirect()` called inside a Server Action | NO |
