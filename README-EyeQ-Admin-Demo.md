# EyeQ Club Management UI

This is a frontend scaffold for the EyeQ Club Management Platform designed for SIMATS Engineering tech clubs.

Features included in this UI scaffold:

- Neon-blue themed, black background, glassmorphism cards
- Admin Dashboard with summary stats and member activity
- Member Approval table with approve/reject
- Event Management list with QR code generation (uses a free QR API), QR-based attendance simulation and per-event attendance logs
- Analytics with member growth charts, event attendance charts, achievements library, attendance logs, and CSV/Excel/print exports
- ChatHub (UI scaffold)
- AI Tools page removed (was a UI scaffold) *removed from admin nav*
- Portfolio & Alumni pages (UI scaffolds)
- Login and SignUp UI forms

Tech Stack:
- React + Vite with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- Recharts for charts
- Radix UI primitives and custom components

How to run:
1. Install dependencies
```powershell
npm install
```
2. Run dev server
```powershell
npm run dev
```

Next steps (recommended):
- Add backend endpoints for authentication, members, events, and chat
- Connect real QR generation and certificate generation logic
- Wire AI features into a serverless AI inferencing API
- Add role-based access control for routes and components

Design notes:
- Uses glass-card `.glass-card`, neon button `.neon-btn`, and neon glow `.neon-glow` CSS utilities added in `src/index.css`.
- Admin layout uses `Sidebar` and `SidebarProvider` in `src/components/eyeq/EyeQLayout.tsx`.

Enjoy the UI scaffold — reach out if you want me to wire a backend or build the AI microservices next.
