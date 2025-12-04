# Photo & Avatar Uploads

This document explains the storage schema, security rules, and example usage for uploading user avatars and photos.

Storage paths
- Avatars: `users/{uid}/avatars/{filename}` — single avatar per user; avatar URL kept on `users/{uid}.avatar_url`.
- Photos: `users/{uid}/photos/{timestamp}_{filename}` — stored in Storage; metadata goes to subcollection `users/{uid}/updates`.

Security rules
- Firestore rules are in the repository at `firestore.rules`.
- Storage rules are in the repository at `storage.rules`.

Key rule behavior
- `users/{uid}`: only the authenticated user (`request.auth.uid == uid`) or an admin (`request.auth.token.admin == true`) can write.
- `users/{uid}/updates`: same restrictions as user doc for writes; reads require auth.
- `invites`: admin-only read/write.

Frontend examples
1) Avatar upload (React)

```tsx
import AvatarUploader from '../components/AvatarUploader';

function Profile() {
  return (
    <div>
      <h2>Profile</h2>
      <AvatarUploader />
    </div>
  );
}
```

2) Photo upload (React)

```tsx
import PhotoUploader from '../components/PhotoUploader';

function Feed() {
  return (
    <div>
      <h2>New Post</h2>
      <PhotoUploader onComplete={(doc) => console.log('created update', doc)} />
    </div>
  );
}
```

API usage (manual)
- `uploadUserAvatar(uid, file)` — returns `{ url, path }` and updates the `users/{uid}` doc.
- `uploadUserPhoto(uid, file, caption?)` — returns the created update doc and stores the file under `users/{uid}/photos/`.

Deployment
- Deploy rules via Firebase CLI:

```powershell
cd <project-root>
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

Notes
- Make sure the server or admin SDK sets `admin` custom claims for admin users.
- Test uploads in an authenticated environment (the UI components check `useAuth()` and require login).
