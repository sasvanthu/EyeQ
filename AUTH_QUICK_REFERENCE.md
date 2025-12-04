# EyeQ Auth & DB Integration - Quick Reference

## What Was Changed

### Core Changes
1. **Auth System** - Real Firebase auth (no mock users)
2. **Route Guards** - RequireAuth now actually protects routes
3. **Auto Profiles** - First login auto-creates profile from auth data
4. **Invite System** - Admin can send invite links for signup
5. **Database IDs** - Now using Firebase UID instead of email
6. **Backend API** - New endpoint for creating Firebase Auth users

---

## User Flow (New)

```
Request → Admin Approves → Send Invite 
→ User Clicks Link → Signup → Auth Created 
→ Profile Auto-Created → Login → Dashboard
```

---

## Key API Functions Added

```typescript
// Invites
createInvite(email, requestId) → { token, expires_at, ... }
validateInvite(token) → invite data or null
markInviteAsUsed(token) → void

// Members  
createMember(member) → requires member.id (Firebase UID)
updateMember(id, payload) → updated member
approveMember(id) → mark as approved
```

---

## Files to Know

| What | Where |
|------|-------|
| Auth Logic | `src/lib/auth.tsx` |
| Route Guards | `src/components/eyeq/RequireAuth.tsx` |
| DB Operations | `src/lib/api.ts` |
| Admin Approval | `src/pages/admin/MemberApproval.tsx` |
| Signup | `src/pages/auth/SignUp.tsx` |
| Backend Server | `server/index.js` |

---

## Testing Quick Checklist

```
Auth Tests:
  ☐ Sign up works
  ☐ Auto-profile created
  ☐ Login works
  ☐ Logout works

Admin Tests:
  ☐ Admin can login
  ☐ Can see pending requests
  ☐ Can send invites

Route Tests:
  ☐ Unauthenticated → /login
  ☐ Admin only routes protected
  ☐ Member only routes protected

Invite Tests:
  ☐ Valid invite works
  ☐ Invalid invite shows error
  ☐ Expired invite shows error
  ☐ Email pre-filled
```

---

## Setup Checklist

```
Before Testing:
  ☐ Update Firestore security rules
  ☐ Download serviceAccountKey.json (Firebase Console)
  ☐ Place in server/ directory
  ☐ cd server && npm install
  ☐ Run backend server

Verify:
  ☐ No console errors
  ☐ Firebase Auth working
  ☐ Firestore accessible
  ☐ Backend responding to /api/health
```

---

## Common Issues & Fixes

### "No authenticated user"
- Make sure you're creating an account via `/signup?invite=token`
- Don't try to access protected routes without login

### "Profile not found"
- Admin must have a profile with `role: 'admin'` 
- Use Firebase Console to manually create if needed

### "Invite invalid or expired"
- Check invite was created correctly
- Token should be in Firestore at `invites/{token}`
- 7-day expiration timer starts at creation

### Backend endpoint not working
- Ensure `serviceAccountKey.json` is in `server/` folder
- Run `npm install` in server directory
- Check server is running on correct port

---

## Key Improvements

✅ No more mock users cluttering your data  
✅ Real role-based access control  
✅ Secure invite system with expiration  
✅ Auto-profile creation on signup  
✅ Admin control over user creation  
✅ Proper database relationships  
✅ Type-safe profile data  

---

## What Users See

### New User Flow:
1. Fills request form on `/join-us`
2. Admin approves and sends invite
3. Clicks link → `/signup?invite=token`
4. Email pre-filled, sets password
5. Account created → Redirected to dashboard
6. First login → Profile auto-created

### Admin Flow:
1. Logs in to `/admin/login`
2. Views pending requests
3. Clicks "Send Invite"
4. System creates invite link
5. Shares link with user (copy button available)

### Existing User:
1. Just logs in normally
2. Auth system finds their profile
3. Loads their data
4. Protected routes work

---

## Emergency: Reset a User

If something goes wrong with a profile:

```typescript
// In browser console (if authenticated as admin):
import { deleteDoc } from 'firebase/firestore';
import { doc, db } from '@/lib/firebase';

// Delete the profile (user can sign up again)
await deleteDoc(doc(db, 'users', 'uid-here'));

// User can then sign up again with invite
```

Or use Firebase Console to delete the document directly.

---

## What Happens at Each Step

### Step 1: Request Submission
- User fills form at `/join-us`
- Creates `requests/{id}` document with status: 'pending'

### Step 2: Admin Approves
- Admin clicks "Send Invite"
- System creates `invites/{token}`
- Sets expiration to 7 days from now

### Step 3: User Clicks Link
- Visits `/signup?invite=token`
- System validates token
- Checks it exists, not expired, not used
- Pre-fills email field

### Step 4: User Creates Account
- Sets password
- Clicks "Create Account"
- Firebase Auth creates user
- System creates `users/{uid}` profile
- Marks invite as used
- Updates request status to 'approved'

### Step 5: First Login
- User logs in with email/password
- Auth system finds their profile
- Loads their data
- They can access dashboard

---

## Database Structure

```
Firestore
├── users/
│   └── {firebase-uid}/
│       ├── email
│       ├── full_name
│       ├── role
│       ├── created_at
│       └── ...
├── requests/
│   └── {doc-id}/
│       ├── full_name
│       ├── email
│       ├── status
│       └── ...
├── invites/
│   └── {token}/
│       ├── email
│       ├── request_id
│       ├── expires_at
│       └── used
└── ... (other collections)
```

---

**Last Updated**: December 3, 2025  
**Status**: Ready for Testing ✅
