# Testing Guide - Step by Step

## Pre-Test Checklist

### 1. Backend Setup
```bash
cd server
npm install firebase-admin
# Add serviceAccountKey.json here
npm start
# Should see: "Certificate server running on port 4000"
```

### 2. Frontend Setup
```bash
cd .. # Back to root
npm install  # If needed
npm run dev  # Start dev server
```

### 3. Firebase Console
- Go to Project Settings → Service Accounts
- Download `serviceAccountKey.json`
- Copy to `server/` folder

### 4. Firestore Rules
Update at Firebase Console → Firestore → Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read/write requests (for the form)
    match /requests/{id} {
      allow read, write: if true;
    }
    
    // Users can only read/write their own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid || request.auth.token.admin == true;
    }
    
    // Invites can be read by anyone (for signup validation)
    match /invites/{token} {
      allow read: if true;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## Test Scenario 1: New User Signup via Invite

### A. Submit Request Form
1. Open `http://localhost:5173/join-us`
2. Fill in form:
   - Name: "John Test"
   - Email: "john.test@example.com"
   - Department: "Engineering"
   - Skills: Add "React", "TypeScript"
   - Reason: "Want to learn"
3. Click "Submit Request"
4. **Check**: Request appears in Firebase Firestore at `requests/{id}`

### B. Admin Approves & Sends Invite
1. Go to `http://localhost:5173/admin/login`
   - Username: `admin` (or use actual admin email)
   - Password: (your admin password)
2. Should see `/admin/dashboard` after login
3. Click "Member Requests" in sidebar
4. See pending request for "john.test@example.com"
5. Click "Send Invite" button
6. **Check**: 
   - Invite document created in Firebase at `invites/{token}`
   - Status badge changes or request moves to history
   - Browser toast shows success

### C. Copy Invite Link
1. Look for copy button or notification with the link
2. Link should be: `http://localhost:5173/signup?invite={token}`
3. Copy the link

### D. User Clicks Invite & Signs Up
1. Open the invite link in new tab (or incognito)
2. **Check**:
   - Email field is pre-filled with "john.test@example.com"
   - No errors shown
3. Set password: "Password123!"
4. Confirm password: "Password123!"
5. Click "Create Account"
6. **Check**:
   - Account created in Firebase Auth
   - Redirected to `/dashboard`
   - Toast shows "Account Created!"

### E. Verify Profile Created
1. Go to Firebase Console → Firestore
2. Check `users/` collection
3. **Should see**:
   - New document with Firebase UID as ID
   - Fields: email, full_name, role: 'member', created_at, etc.

### F. Logout & Login Again
1. Click logout (if there's a button)
2. Or navigate to `/login`
3. Enter email: "john.test@example.com"
4. Enter password: "Password123!"
5. Click "Login"
6. **Check**:
   - Redirected to `/dashboard` or member area
   - Profile loads correctly
   - Auth state shows user is authenticated

---

## Test Scenario 2: Route Protection

### A. Test Unauthenticated Access
1. Sign out if logged in
2. Try to visit: `http://localhost:5173/dashboard`
3. **Expected**: Redirected to `/login`

### B. Test Admin Routes
1. Sign in as regular member (from above test)
2. Try to visit: `http://localhost:5173/admin/dashboard`
3. **Expected**: Redirected to home page (no admin access)

### C. Test Admin Login
1. Logout
2. Go to `/admin/login`
3. Use admin credentials
4. **Expected**: 
   - Can access admin dashboard
   - Can see pending requests
   - Can manage members

---

## Test Scenario 3: Invite Validation

### A. Test Expired Invite
1. In Firebase Console, go to `invites/` collection
2. Find an invite document
3. Edit `expires_at` to a past date (yesterday)
4. Save changes
5. Try to use that invite link in signup
6. **Expected**: Error message "This invite is invalid or has expired"

### B. Test Invalid Token
1. Go to: `http://localhost:5173/signup?invite=notarealtoken`
2. **Expected**: Error message "This invite is invalid or has expired"

### C. Test Used Invite
1. Find an invite document that was already used (used: true)
2. Try to use its link
3. **Expected**: Error message about invalid invite

### D. Test Email Pre-Fill
1. Get a valid invite token
2. Visit: `/signup?invite={valid-token}`
3. **Expected**:
   - Page loads without error
   - Email field is pre-filled
   - User doesn't see error message

---

## Test Scenario 4: Database Integrity

### A. Verify Document Structure
1. Firebase Console → Firestore
2. Check any document in `users/` collection
3. **Should have**:
   ```
   id: "firebase-uid-here"
   email: "user@example.com"
   full_name: "User Name"
   role: "member" or "admin"
   avatar_url: "https://..."
   created_at: timestamp
   streaks: { current: 0 }
   xp: 0
   ```

### B. Verify No Email-Based IDs
1. Firebase Console → Firestore → users
2. Check document IDs
3. **Expected**: All IDs are long strings (Firebase UIDs), NOT emails

### C. Verify Invite Structure
1. Check any document in `invites/` collection
2. **Should have**:
   ```
   email: "invited@example.com"
   request_id: "reference-to-request"
   token: "unique-long-string"
   created_at: timestamp
   expires_at: timestamp (7 days later)
   used: true/false
   ```

---

## Test Scenario 5: Error Handling

### A. Duplicate Email Signup
1. In Firebase Auth, create user: "duplicate@test.com"
2. Create invite for same email
3. Try to signup with invite for "duplicate@test.com"
4. **Expected**: Error like "Email already in use"

### B. Password Mismatch
1. Get valid invite
2. Visit signup page
3. Enter different password and confirm password
4. **Expected**: Error "Passwords do not match"

### C. Missing Fields
1. Get valid invite
2. Try to submit without password
3. **Expected**: Form validation error

### D. Network Error
1. Disconnect internet
2. Try to sign up
3. **Expected**: Error message about network
4. Reconnect internet
5. Try again
6. **Expected**: Works

---

## Test Scenario 6: Admin Functions

### A. View All Members
1. Login as admin
2. Go to `/admin/members` (or members list)
3. **Expected**: See all members from `users/` collection

### B. View Pending Requests
1. Login as admin
2. Go to member approval page
3. **Expected**: See all requests with status: 'pending'

### C. Approve Request
1. Find pending request
2. Click "Send Invite"
3. **Expected**:
   - Invite created in Firestore
   - Request status updated to 'approved'
   - User gets success toast

### D. Reject Request
1. Find pending request
2. Click "Reject"
3. **Expected**:
   - Request status updated to 'rejected'
   - User gets success toast
   - Request moves to history

---

## Debugging Tips

### Check Browser Console
```javascript
// Check if user is authenticated
import { auth } from '@/lib/firebase';
console.log(auth.currentUser);

// Check if profile is loaded
import { useAuth } from '@/lib/auth';
const { user, profile, loading } = useAuth();
console.log({ user, profile, loading });
```

### Check Network Requests
1. Open DevTools → Network
2. Look for Firebase requests
3. Check response codes (200 = good, 4xx = error)

### Check Firestore
1. Firebase Console → Firestore
2. Verify documents exist
3. Check field values match expected
4. Look at timestamps to verify recent writes

### Check Firebase Auth
1. Firebase Console → Authentication
2. Should see user accounts created during signup
3. Verify email matches

### Check Backend
```bash
# In another terminal
curl http://localhost:4000/api/health
# Should return: { status: 'ok', timestamp: '...', firebaseAdminReady: true/false }
```

---

## Common Test Issues & Solutions

| Issue | Check | Solution |
|-------|-------|----------|
| Invite link shows error | Firestore `invites/` collection | Token should exist and not be expired |
| Can't login as admin | Firebase Auth & user profile | Ensure user has `role: 'admin'` in Firestore |
| Route keeps redirecting | RequireAuth component | Check user is authenticated: `auth.currentUser` |
| Profile not auto-created | Firestore `users/` collection | Check signup completed successfully |
| No data after login | Check Firestore rules | Rules might be too restrictive |
| Backend endpoint 404 | Server console | Make sure server is running on port 4000 |

---

## Success Criteria ✅

**All tests pass when**:
- [ ] New user can sign up via invite
- [ ] Profile auto-created after first login
- [ ] Routes protected (redirect to login)
- [ ] Admin can approve requests
- [ ] Admin can send invites
- [ ] Invites expire after 7 days
- [ ] Database uses Firebase UIDs as document IDs
- [ ] No more mock users
- [ ] Errors shown for invalid invites
- [ ] User data persists across sessions

---

## Final Verification

Once all tests pass, verify:

```bash
# 1. Check no mock users exist
# Go to Firebase Console → Authentication
# No users with email like "newuser@eyeq.com"

# 2. Check Firestore structure
# users/ docs use long UIDs as IDs, not emails
# All required fields present

# 3. Check auth context
# No hardcoded test users
# Real Firebase auth flow working

# 4. Check routes
# Unauthenticated → /login
# Admin-only routes require admin role
# Loading state shows while checking auth
```

---

**Status**: Ready for Testing ✅  
**Last Updated**: December 3, 2025
