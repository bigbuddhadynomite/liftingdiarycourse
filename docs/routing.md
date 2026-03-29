# Routing

## RULE: All App Routes Live Under /dashboard

Every application route must be nested under `/dashboard`. There are no top-level app pages outside of auth and the root redirect.

- **NEVER** create app feature pages at the root level (e.g. `/workouts`, `/profile`)
- All feature routes follow the pattern `/dashboard/<feature>` (e.g. `/dashboard/workout`, `/dashboard/profile`)
- The root `/` should redirect to `/dashboard` or a sign-in page

## RULE: /dashboard Routes Are Protected

All routes under `/dashboard` are protected and require an authenticated user. Route protection is enforced via Next.js middleware — **not** inside individual pages or layouts.

- **NEVER** manually check for authentication inside a page or layout to protect a route
- **NEVER** redirect unauthenticated users from within a Server Component as the primary protection mechanism
- Middleware is the single enforcement point for route protection

## Middleware Setup

Route protection is handled in `middleware.ts` at the project root using Clerk:

```ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
```

Any route not listed in `isPublicRoute` is automatically protected. To add a new public route (e.g. a marketing page), add it to the matcher array — do not add auth checks inside the page itself.

## File Structure

Routes follow Next.js App Router file-based conventions under `src/app/`:

```
src/app/
  page.tsx                          # Root — redirect to /dashboard
  dashboard/
    layout.tsx                      # Shared dashboard layout
    page.tsx                        # /dashboard
    workout/
      page.tsx                      # /dashboard/workout
      [workoutId]/
        page.tsx                    # /dashboard/workout/:workoutId
```

## Summary

| Rule | Detail |
|---|---|
| All app routes | Must be under `/dashboard` |
| Route protection | Middleware only — never inside pages |
| Auth library | Clerk (`clerkMiddleware`) |
| Public routes | `/`, `/sign-in`, `/sign-up` only |
| Feature routes at root level | NOT allowed |
