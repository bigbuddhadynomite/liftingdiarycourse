# Server Components

## RULE: All Page Components Must Be Async

Server Component pages must be declared `async`. This is required to `await` params, `searchParams`, and any data fetching.

```ts
// ✅ CORRECT
export default async function WorkoutPage({ params }: Props) { ... }

// ❌ WRONG
export default function WorkoutPage({ params }: Props) { ... }
```

## RULE: `params` and `searchParams` MUST Be Awaited

In this version of Next.js, `params` and `searchParams` are **Promises**. You MUST `await` them before accessing any property. Accessing properties directly (without `await`) will silently return `undefined`.

```ts
// ✅ CORRECT — params is a Promise, must be awaited
interface Props {
  params: Promise<{ workoutid: string }>;
}

export default async function WorkoutPage({ params }: Props) {
  const { workoutid } = await params;
}

// ❌ WRONG — params is not a plain object in this version
interface Props {
  params: { workoutid: string };
}

export default async function WorkoutPage({ params }: Props) {
  const { workoutid } = params; // undefined — not awaited
}
```

The same rule applies to `searchParams`:

```ts
// ✅ CORRECT
interface Props {
  searchParams: Promise<{ date?: string }>;
}

export default async function Page({ searchParams }: Props) {
  const { date } = await searchParams;
}
```

## RULE: Always Validate Route Params Before Use

Route params arrive as strings. Always validate and parse them before passing to data helpers. Use `notFound()` from `next/navigation` for invalid or missing values.

```ts
import { notFound } from "next/navigation";

const workoutId = parseInt(workoutid, 10);
if (isNaN(workoutId)) {
  notFound();
}
```

## RULE: Never Fetch Data in Client Components

Server Components are the only place data fetching is allowed. If a Client Component needs data, fetch it in a Server Component parent and pass it as props.

```ts
// ✅ CORRECT — Server Component fetches, Client Component receives props
// page.tsx (Server Component)
const workout = await getWorkoutById(userId, workoutId);
return <EditWorkoutForm workout={workout} />;

// edit-workout-form.tsx ("use client")
export default function EditWorkoutForm({ workout }: Props) { ... }
```

See [data-fetching.md](./data-fetching.md) for the full data fetching rules.

## Summary

| Rule | Required |
|---|---|
| Page component is `async` | YES |
| `params` typed as `Promise<{...}>` | YES |
| `params` destructured with `await` | YES |
| `searchParams` typed as `Promise<{...}>` | YES |
| `searchParams` destructured with `await` | YES |
| Route params validated before use | YES |
| `notFound()` called for invalid params | YES |
| Data fetching in Server Components only | YES |
