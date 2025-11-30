# EyeQ Club Management Platform — UI Scaffold

This branch provides a first-pass UI-focused implementation of the EyeQ Club Management Platform, emphasizing a modern neon-blue, glassmorphism aesthetic and scalable layout.

## What was implemented ✅

- A new neon, glass-card visual theme with soft glows and 3D micro-interactions.
- Admin dashboard with stats, growth charts, recent activity — built with Recharts.
- Member Approval flow with search/filter, modal confirm, view profile, approve/reject.
- Events management: create/edit mock events, calendar, QR generator (public QR API), print certificate generator.
- Analytics page with CSV export and event attendance chart.
- Chat Hub (community chat UI scaffold) and simple messaging functionality (mocked).
- AI Tools page removed from demo; AI components remain for future integration.
- Portfolio & Projects page skeleton with generator and project upload placeholders.
- Alumni page skeleton with profile browsing and messaging placeholders.
- Authentication: mock login & signup pages for members and admins.
- `GlassCard`, `NeonButton`, `StatCard`, and the `EyeQLayout` wrapper including a responsive sidebar for navigation.
- `mock-api.tsx` with sample data to enable frontend demonstrations without a backend.

## Where to find it

- Admin Dashboard: `/admin/dashboard`
- Member approvals: `/admin/members`
- Events manager: `/admin/events`
- Analytics: `/admin/analytics`
- Chat: `/admin/chat`
- AI: (removed from demo)
- Portfolio: `/admin/portfolio`
- Alumni: `/admin/alumni`
- Login: `/login` — Signup: `/signup`

## How to run

Install dependencies and run the dev server:

```powershell
npm install
npm run dev
```

Then open http://localhost:5173 (default Vite dev port) and navigate to admin routes.

## Next steps & recommended enhancements 🚀

- Authentication & role-based access: integrate an auth backend (Firebase, NextAuth, or your own server) and map roles to UI access.
- Backend endpoints for members/events/analytics & real-time chat (WebSocket or Socket.IO) for ChatHub.
- AI backend integrations for the AI tools (OpenAI, Anthropic, LLMs) for skill analysis, code review, CV analysis, and summarization.
- Implement QR attendance scanning (mobile-friendly) and integrate certificate generation (PDF, signed credentials).
- Add automated tests and e2e tests for flows (Cypress included in repo already).
- Convert mock UI to real components and wire up to endpoints, handle pagination, upload, validation, and file storage (S3 or similar).

## Visual & UX notes

- The neon and glass styles are defined in `src/index.css` — look for `.glass-card`, `.neon-btn`, `.neon-glow`, and `.neon-badge`.
- Use existing UI primitives in `src/components/ui` to keep consistent styling and accessibility.

If you'd like, I can proceed to wire in role-based route guards and add a small Express or serverless backend that supports simple authentication, member CRUD, event CRUD, QR generation, and the AI pipelines. Tell me which backend/API strategy you'd prefer (Firebase, Supabase, Node.js/Express, FastAPI, or serverless functions) and I can scaffold it. 
