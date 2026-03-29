# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do not create custom UI components.
- Do not use raw HTML elements for UI chrome (buttons, inputs, cards, dialogs, etc.) when a shadcn/ui equivalent exists.
- Install new shadcn/ui components as needed via `npx shadcn@latest add <component>`.
- All shadcn/ui components live in `src/components/ui/` — do not modify them directly.

## Date Formatting

Use [date-fns](https://date-fns.org/) for all date formatting. Do not use `Date.toLocaleDateString()`, `Intl.DateTimeFormat`, or any other date formatting approach.

Dates must be formatted using ordinal day, abbreviated month, and full year:

| Example output |
|----------------|
| 1st Sep 2025   |
| 2nd Aug 2025   |
| 3rd Jan 2026   |
| 4th Jun 2024   |

### Implementation

```ts
import { format } from "date-fns";

function formatDate(date: Date): string {
  return format(date, "do MMM yyyy");
}
```

`date-fns` `format` tokens:
- `do` — ordinal day (1st, 2nd, 3rd, 4th…)
- `MMM` — abbreviated month (Jan, Feb, Mar…)
- `yyyy` — four-digit year
