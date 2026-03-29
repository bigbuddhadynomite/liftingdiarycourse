# Authentication

## RULE: Clerk for All Authentication

This app uses **Clerk** for all authentication. Do not use NextAuth, Auth.js, custom JWT logic, or any other auth library.

- **NEVER** implement custom session management
- **NEVER** use `next-auth` or any other auth library
- **NEVER** store passwords or tokens manually
- All sign-in, sign-up, and session handling is delegated entirely to Clerk

## Getting the Current User

Always get the current user's ID via Clerk's `auth()` helper in Server Components:

```ts
import { auth } from "@clerk/nextjs/server";

export default async function SomePage() {
  const { userId } = await auth();

  if (!userId) {
    // handle unauthenticated state
  }
}
```

Do not use `currentUser()` unless you need the full user object — `auth()` is cheaper and preferred when only the ID is needed.

## Protecting Routes

Use Clerk middleware to protect routes. Define protected and public routes in `middleware.ts` at the project root:

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

## UI Components

Use Clerk's pre-built UI components for all auth-related UI. Do not build custom sign-in or sign-up forms.

| Purpose | Component |
|---|---|
| Sign in | `<SignIn />` |
| Sign up | `<SignUp />` |
| User profile | `<UserButton />` |
| Show content only when signed in | `<SignedIn />` |
| Show content only when signed out | `<SignedOut />` |

## Clerk and Data Security

Clerk's `userId` is the source of truth for the current user. All data queries MUST be scoped to this ID — see `data-fetching.md` for the full rule.

- Always call `auth()` at the Server Component level to retrieve `userId`
- Pass `userId` into `/data` helpers — never trust a user-supplied ID from params or query strings alone

## Summary

| Approach | Allowed |
|---|---|
| Clerk `auth()` to get current user | YES |
| Clerk middleware to protect routes | YES |
| Clerk pre-built UI components | YES |
| Custom session/token management | NO |
| NextAuth / Auth.js | NO |
| Any other auth library | NO |
