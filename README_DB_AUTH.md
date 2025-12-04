# Database & Authentication Implementation Plan

This document outlines the architecture, implementation details, and management strategies for the Authentication and Database layers of the EyeQ application, powered by **Firebase**.

## 1. Architecture Overview

We use **Firebase** as our backend-as-a-service (BaaS) provider.
- **Authentication**: Firebase Authentication (Email/Password, Google, etc.)
- **Database**: Cloud Firestore (NoSQL)
- **Storage**: Cloud Storage for Firebase (Images/Assets)

## 2. Authentication

### 2.1. Setup
Authentication is initialized in `src/lib/firebase.ts` and managed globally via the `AuthContext` in `src/lib/auth.tsx`.

**Key Components:**
- **`AuthProvider`**: Wraps the application to provide user state.
- **`useAuth()` Hook**: Exposes `user`, `profile`, `loading`, `signOut`, and `isAdmin`.

### 2.2. User Profile Management
We maintain a dual-state for users:
1.  **Auth Object**: Managed by Firebase Auth (contains `uid`, `email`, `displayName`).
2.  **User Document**: Stored in Firestore `users/{userId}` (contains `role`, `xp`, `streaks`, etc.).

**Auto-Creation Logic:**
When a user logs in, `src/lib/auth.tsx` checks for a corresponding Firestore document. If it doesn't exist (first login), it automatically creates one with default values:
```typescript
{
  id: userId,
  full_name: currentUser.displayName,
  email: currentUser.email,
  role: 'member', // Default role
  xp: 0,
  streaks: { current: 0 }
}
```

### 2.3. Role-Based Access Control (RBAC)
Roles are defined in the `users` Firestore document.
- **`member`**: Standard access. Can view public content and manage their own projects.
- **`admin`**: Full access. Can manage events, gallery, and other users' content.

**Implementation:**
- **Frontend**: `RequireAuth` component checks for authentication. Admin routes check `profile.role === 'admin'`.
- **Backend**: Firestore Security Rules enforce permissions.

## 3. Database (Cloud Firestore)

### 3.1. Schema Design
The database is document-oriented. Below are the primary collections:

#### `users`
Stores extended user profile data.
- `id` (string): Matches Auth UID.
- `full_name` (string)
- `role` (string): 'admin' | 'member'
- `xp` (number): Gamification points.
- `streaks` (map): `{ current: number }`

#### `events`
Stores club events.
- `title` (string)
- `date` (timestamp)
- `description` (string)
- `location` (string)
- `attendees` (array): List of User UIDs.

#### `projects`
Member-submitted projects.
- `title` (string)
- `userId` (string): Owner's UID.
- `description` (string)
- `imageUrl` (string)
- `link` (string)

#### `gallery`
Images for the gallery page.
- `url` (string)
- `caption` (string)
- `uploadedBy` (string)

### 3.2. Security Rules (`firestore.rules`)
Security is enforced at the database level.
- **Public Read**: `events`, `gallery`, `projects` (metadata).
- **Authenticated Read**: `users` (own profile).
- **Owner Write**: `projects` (users can only edit their own).
- **Admin Write**: Full write access to `events`, `gallery`, and `projects`.

## 4. Implementation Guide

### 4.1. Protecting a Route
Wrap protected components with `RequireAuth`.
```tsx
<Route path="/dashboard" element={
  <RequireAuth>
    <Dashboard />
  </RequireAuth>
} />
```

### 4.2. Accessing User Data
Use the hook in any component:
```tsx
const { user, profile, isAdmin } = useAuth();

if (loading) return <Spinner />;
if (isAdmin) return <AdminPanel />;
return <div>Welcome, {profile?.full_name}</div>;
```

### 4.3. Database Operations
Use standard Firebase v9 modular SDK functions.
```tsx
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Example: Add a project
await addDoc(collection(db, 'projects'), {
  title: 'New Project',
  userId: user.uid,
  // ...
});
```

## 5. Control & Management

### 5.1. Managing Users
Currently, user management (promoting to admin, banning) is done via the **Firebase Console**.
1.  Go to Firestore Database > `users` collection.
2.  Find the user document.
3.  Update the `role` field to `'admin'`.

### 5.2. Future Admin Dashboard
An in-app Admin Dashboard is planned to allow admins to:
- Approve/Reject member projects.
- Create/Edit events without using the console.
- Manage gallery images.

## 6. Checklist for Developers
- [ ] Ensure `.env` contains all `VITE_FIREBASE_*` keys.
- [ ] Do not commit sensitive keys (though Firebase config is generally public, keep it safe).
- [ ] Always handle `loading` state from `useAuth`.
- [ ] Test security rules using the Firebase Emulator if possible.
