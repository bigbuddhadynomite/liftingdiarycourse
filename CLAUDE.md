# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
```

## Architecture

- **Framework**: Next.js 16 with App Router (`src/app/` directory)
- **Language**: TypeScript (strict mode), path alias `@/*` → `./src/*`
- **Styling**: Tailwind CSS 4 via PostCSS
- **React**: v19 — Server Components by default; add `"use client"` only when needed

Routes are file-based under `src/app/`. Root layout is `src/app/layout.tsx`. Before writing any Next.js code, read the relevant guide in `node_modules/next/dist/docs/` — this version has breaking changes.
