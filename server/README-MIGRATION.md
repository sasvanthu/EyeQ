# Server Migration & Admin Tasks

This file explains how to run the migration script and how to use the new admin endpoints.

Prerequisites
- Place `serviceAccountKey.json` in `server/` (Firebase service account with Firestore and Auth privileges).
- Install server dependencies:

```powershell
cd server
npm install
```

Run migration script

```powershell
cd server
node migrate_users_to_uid.js
```

This will copy `users/{email-key}` documents to `users/{uid}` if a corresponding Auth user exists for that email.

Admin API key

- Create an environment variable `ADMIN_API_KEY` for protecting admin endpoints.
- Example on Windows PowerShell:

```powershell
$env:ADMIN_API_KEY = "your-secret-key"
```

Server endpoints (admin protected via `x-admin-key` header or `?admin_key=` query):
- `POST /api/invites/send` — create invite document in Firestore (body: `{ email, fullName, requestId }`) returns `invite` and `signupLink`.
- `GET /api/invites/validate/:token` — validate invite token and returns invite data.
- `POST /api/invites/create-user` — admin-only; creates a Firebase Auth user from invite token (body: `{ token, password? }`).
- `POST /api/admin/set-claim` — admin-only; set custom user claims (body: `{ uid, claimKey, claimValue? }`).

Notes
- In production, set `ADMIN_API_KEY` to a strong secret and ensure your server runs over HTTPS.
- After setting custom claims, clients must re-authenticate to receive the new claims in their ID token.
