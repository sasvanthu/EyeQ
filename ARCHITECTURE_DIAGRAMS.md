# Architecture Diagrams & Flow Charts

## 1. User Registration Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION FLOW                        │
└─────────────────────────────────────────────────────────────────┘

STEP 1: Request Submission
┌──────────────────┐
│  User visits     │
│  /join-us        │
│  Fills form      │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Firestore                                │
│ requests/{id}                            │
│  ├─ full_name                            │
│  ├─ email                                │
│  ├─ department                           │
│  ├─ skills                               │
│  ├─ status: 'pending'  ◄── (NEW)        │
│  └─ created_at                           │
└──────────────────────────────────────────┘

STEP 2: Admin Approval
┌──────────────────┐
│  Admin logs in   │
│  /admin/login    │
│                  │
│  Views pending   │
│  requests        │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  Admin sees:                             │
│  - Full_name: John Test                  │
│  - Email: john@test.com                  │
│  - Dept: Engineering                     │
│  - [Send Invite] ◄── (NEW BUTTON)       │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│ Firestore                                │
│ invites/{token}               (NEW!)     │
│  ├─ email: john@test.com                 │
│  ├─ request_id: {id}                     │
│  ├─ token: 'xyz123...'                   │
│  ├─ created_at: NOW                      │
│  ├─ expires_at: NOW + 7 days             │
│  └─ used: false                          │
└──────────────────────────────────────────┘

STEP 3: User Gets Invite
┌──────────────────────────────────────────┐
│  Admin shares:                           │
│  http://app.com/signup?invite=xyz123..  │
│                                          │
│  OR                                      │
│                                          │
│  Email with link                         │
│  (Implementation up to you)              │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────┐
│  User clicks     │
│  invite link     │
│  or copies it    │
└────────┬─────────┘
         │
         ▼

STEP 4: Signup with Invite
┌──────────────────────────────────────────┐
│  Frontend: /signup?invite=xyz123...      │
│                                          │
│  1. Validate token                       │
│     ✓ Exists in invites/                 │
│     ✓ Not expired                        │
│     ✓ Not used yet                       │
│                                          │
│  2. Pre-fill email                       │
│     Email: john@test.com ✓ (auto-filled) │
│                                          │
│  3. User sets password                   │
│     Password: ••••••••                   │
│                                          │
│  4. Click "Create Account"               │
└────────┬─────────────────────────────────┘
         │
         ▼

STEP 5: Account Creation
┌──────────────────────────────────────────┐
│  Firebase Auth                           │
│  User created                            │
│  ├─ Email: john@test.com                 │
│  ├─ Password: hashed                     │
│  ├─ UID: 'firebase_uid_xyz'             │
│  └─ displayName: (from signup)           │
└────────┬─────────────────────────────────┘
         │
         ▼

STEP 6: Profile Creation
┌──────────────────────────────────────────┐
│  Firestore                               │
│  users/{firebase_uid_xyz}                │
│  ├─ id: 'firebase_uid_xyz'              │
│  ├─ email: john@test.com                 │
│  ├─ full_name: John Test                 │
│  ├─ role: 'member'                       │
│  ├─ avatar_url: 'https://...'           │
│  ├─ streaks: { current: 0 }             │
│  ├─ xp: 0                                │
│  └─ created_at: NOW                      │
└────────┬─────────────────────────────────┘
         │
         ▼

STEP 7: Cleanup
┌──────────────────────────────────────────┐
│  Update Firestore                        │
│                                          │
│  invites/{token}                         │
│  ├─ used: true  ◄── MARKED AS USED      │
│                                          │
│  requests/{id}                           │
│  ├─ status: 'approved'  ◄── UPDATED     │
└────────┬─────────────────────────────────┘
         │
         ▼

STEP 8: Redirect
┌──────────────────┐
│  Redirect to     │
│  /dashboard      │
│                  │
│  User can see    │
│  their profile   │
└──────────────────┘
```

---

## 2. Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   AUTHENTICATION FLOW                            │
└─────────────────────────────────────────────────────────────────┘

USER NOT LOGGED IN
┌─────────────────────────────────────────┐
│  Visits protected route                 │
│  e.g., /dashboard                       │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  RequireAuth Component                  │
│                                         │
│  1. Check auth.currentUser              │
│     → null                              │
│                                         │
│  2. Check loading state                 │
│     → false                             │
│                                         │
│  3. User not authenticated              │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Redirect to /login                     │
│                                         │
│  Save current location for post-login   │
│  redirect                               │
└─────────────────────────────────────────┘


USER LOGS IN
┌─────────────────────────────────────────┐
│  User enters email & password           │
│  at /login                              │
│                                         │
│  Clicks "Login"                         │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Firebase Auth                          │
│                                         │
│  signInWithEmailAndPassword()           │
│  ├─ Email: john@test.com               │
│  ├─ Password: ••••••••                 │
│  └─ → User object with UID             │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  AuthProvider (useContext)              │
│                                         │
│  onAuthStateChanged fires               │
│  ├─ currentUser exists!                │
│  ├─ Set user state                     │
│  └─ Call fetchProfile(uid)             │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Fetch Profile from Firestore           │
│                                         │
│  getDoc(users/{uid})                    │
│  ├─ Document exists?                   │
│  │  ├─ YES → Load profile data         │
│  │  └─ NO  → Create auto-profile       │
│  └─ Set profile state                  │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  AuthContext Updated                    │
│                                         │
│  ├─ user: User object ✓                 │
│  ├─ profile: Profile data ✓             │
│  ├─ loading: false ✓                    │
│  └─ isAdmin: profile.role == 'admin'   │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  RequireAuth checks again               │
│                                         │
│  1. loading? → false ✓                  │
│  2. user exists? → YES ✓                │
│  3. has required role? → YES ✓          │
│                                         │
│  → Render children!                     │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  User sees protected content            │
│  e.g., /dashboard                       │
│                                         │
│  Can access all member features         │
└─────────────────────────────────────────┘
```

---

## 3. Admin-Only Route Protection

```
┌─────────────────────────────────────────────────────────────────┐
│            ADMIN ROUTE PROTECTION                               │
└─────────────────────────────────────────────────────────────────┘

REGULAR MEMBER TRIES TO ACCESS /admin/dashboard
┌────────────────────────────────┐
│  User with role: 'member'      │
│  Tries to visit                │
│  /admin/dashboard              │
└────────┬───────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  RequireAuth with roles={['admin']}                             │
│                                                                 │
│  Check 1: Is user authenticated?                               │
│  ├─ user exists? YES ✓                                         │
│  └─ loading? NO ✓                                              │
│                                                                 │
│  Check 2: Has required role?                                   │
│  ├─ roles specified? YES ✓                                     │
│  ├─ Loop through roles: ['admin']                              │
│  ├─ role == 'admin'? → Check isAdmin                           │
│  ├─ isAdmin = profile.role === 'admin'                         │
│  ├─ profile.role = 'member'                                    │
│  └─ isAdmin = FALSE ✗                                          │
│                                                                 │
│  No matching role found                                         │
└────────┬───────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Redirect to /                 │
│                                │
│  (Home page)                   │
│  Access denied silently        │
└────────────────────────────────┘


ADMIN TRIES TO ACCESS /admin/dashboard
┌────────────────────────────────┐
│  User with role: 'admin'       │
│  Tries to visit                │
│  /admin/dashboard              │
└────────┬───────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│  RequireAuth with roles={['admin']}                             │
│                                                                 │
│  Check 1: Is user authenticated?                               │
│  ├─ user exists? YES ✓                                         │
│  └─ loading? NO ✓                                              │
│                                                                 │
│  Check 2: Has required role?                                   │
│  ├─ roles specified? YES ✓                                     │
│  ├─ Loop through roles: ['admin']                              │
│  ├─ role == 'admin'? → Check isAdmin                           │
│  ├─ isAdmin = profile.role === 'admin'                         │
│  ├─ profile.role = 'admin'                                     │
│  └─ isAdmin = TRUE ✓                                           │
│                                                                 │
│  Role match found!                                              │
└────────┬───────────────────────────────────────────────────────┘
         │
         ▼
┌────────────────────────────────────────────────────────────────┐
│  Render children                                               │
│                                                                │
│  User sees:                                                    │
│  - Member list                                                │
│  - Pending requests                                           │
│  - Admin controls                                             │
│  - etc.                                                        │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. Database Relationship

```
┌─────────────────────────────────────────────────────────────────┐
│                  DATABASE RELATIONSHIPS                          │
└─────────────────────────────────────────────────────────────────┘

BEFORE (Email-based - WRONG)
┌──────────────────────────────────────────┐
│  Firebase Auth                           │
│  ├─ User                                 │
│  │  ├─ UID: 'abc123def456xyz'          │
│  │  └─ Email: john@test.com             │
└──────────────────────────────────────────┘
               │
               │ (mismatch!)
               ▼
┌──────────────────────────────────────────┐
│  Firestore                               │
│  └─ users/john@test.com  ✗ WRONG!       │
│     ├─ email: john@test.com              │
│     ├─ full_name: John Test              │
│     └─ role: member                      │
└──────────────────────────────────────────┘
               │
         (No connection!)
               ▼
     Profile might be
     orphaned or hard
     to find


AFTER (UID-based - CORRECT)
┌──────────────────────────────────────────┐
│  Firebase Auth                           │
│  ├─ User                                 │
│  │  ├─ UID: 'abc123def456xyz'  ◄─── KEY│
│  │  └─ Email: john@test.com             │
└──────────────────────────────────────────┘
               │
          (Perfect match!)
               │
               ▼
┌──────────────────────────────────────────┐
│  Firestore                               │
│  └─ users/abc123def456xyz  ✓ CORRECT!   │
│     ├─ id: 'abc123def456xyz'            │
│     ├─ email: john@test.com              │
│     ├─ full_name: John Test              │
│     └─ role: member                      │
└──────────────────────────────────────────┘
               │
   (Linked by UID - Easy to find!)
               ▼
      Profile always accessible
      from auth.currentUser.uid


INVITATION RELATIONSHIP
┌──────────────────────────────────────────┐
│  requests/{id}                           │
│  ├─ email: john@test.com                 │
│  ├─ status: 'pending'                    │
│  └─ created_at: NOW                      │
└────────────────┬─────────────────────────┘
                 │
          (user clicks invite)
                 │
                 ▼
┌──────────────────────────────────────────┐
│  invites/{token}                         │
│  ├─ email: john@test.com                 │
│  ├─ request_id: {id} ◄─── LINKED        │
│  ├─ expires_at: NOW + 7 days             │
│  └─ used: false                          │
└────────────────┬─────────────────────────┘
                 │
         (user signs up)
                 │
                 ▼
┌──────────────────────────────────────────┐
│  Firebase Auth                           │
│  ├─ UID: 'new_uid_xyz'  ◄─── CREATED   │
│  └─ Email: john@test.com                 │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│  users/{new_uid_xyz}                     │
│  ├─ email: john@test.com                 │
│  ├─ role: member                         │
│  └─ created_at: NOW                      │
└────────────────┬─────────────────────────┘
                 │
         (update tracking)
                 │
                 ▼
┌──────────────────────────────────────────┐
│  invites/{token}                         │
│  └─ used: true  ◄─── MARKED              │
│                                          │
│  requests/{id}                           │
│  └─ status: 'approved'  ◄─── UPDATED    │
└──────────────────────────────────────────┘
```

---

## 5. Loading State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                    LOADING STATE FLOW                            │
└─────────────────────────────────────────────────────────────────┘

APP STARTS
┌─────────────────────────────┐
│ AuthProvider initializes    │
│                             │
│ loading: true               │
│ user: null                  │
│ profile: null               │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ onAuthStateChanged listener │
│ registers                   │
│                             │
│ (waiting for auth response) │
└────────┬────────────────────┘
         │
    (network delay)
         │
         ▼
┌─────────────────────────────┐
│ Auth system responds        │
│                             │
│ No user logged in?          │
│ ├─ user: null              │
│ ├─ profile: null           │
│ └─ loading: FALSE          │
│    (Done waiting)          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ RequireAuth checks          │
│                             │
│ if (loading) → show Loader  │
│ else if (!user) → redirect  │
│                             │
│ (Loading finished!)         │
└─────────────────────────────┘


DURING SIGNIN
┌─────────────────────────────┐
│ User fills login form       │
│ and clicks "Login"          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ AuthProvider listening...   │
│                             │
│ loading: true ◄─ TRIGGERED │
│ (Auth check in progress)   │
└────────┬────────────────────┘
         │
    (validate credentials)
         │
         ▼
┌─────────────────────────────┐
│ Auth succeeded              │
│                             │
│ ├─ user: User object ✓     │
│ └─ Call fetchProfile()     │
└────────┬────────────────────┘
         │
    (fetch from Firestore)
         │
         ▼
┌─────────────────────────────┐
│ Profile loaded              │
│                             │
│ ├─ profile: loaded data    │
│ ├─ loading: FALSE ✓        │
│ └─ state updated           │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ RequireAuth renders         │
│ children (protected page)   │
│                             │
│ User sees dashboard!        │
└─────────────────────────────┘
```

---

## 6. Data Flow Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE DATA FLOW                            │
└─────────────────────────────────────────────────────────────────┘

USER INTERACTION                SYSTEM                   DATA STORES
─────────────────              ──────                    ───────────

Submit Request ──────────────> Validate Form
  Form                          ├─ Email valid?
  ├─ Name                       └─ Skills array?
  ├─ Email                            │
  ├─ Dept                             ▼
  ├─ Skills                      Create Doc ──────────> Firestore
  └─ Reason                       in requests/        requests/{id}

                                                        ─────────────
                                                        Create in
                                                        Firestore
                                                        ─────────────
                                                               │
Admin Login ──────────────────> Check Email/Pass
  Email                         Against Firebase Auth
  Password                             │
                                       ▼
                                  Create Session
                                  Load Profile ──────> Firestore
                                                       users/{uid}

                                                        ─────────────
                                                        Load profile
                                                        data
                                                        ─────────────
                                                               │
View Pending ──────────────────> Query requests/ ────────────┐
Requests                         where status='pending'        │
                                                               ▼
                                                        Firestore
                                                        Query Result

Send Invite ──────────────────> Generate Token
  Click Button                  ├─ Unique token
                                ├─ 7-day expiry
                                └─ Email from request
                                        │
                                        ▼
                                   Store Doc ───────────────> Firestore
                                   in invites/              invites/{token}

                                                        ─────────────
                                                        Create new
                                                        invite
                                                        ─────────────
                                                               │
User Click Link ───────────────> Validate Token
  /signup?invite=xyz            ├─ Exists?
                                ├─ Expired?
                                └─ Used?
                                        │
                                        ▼
                                   Pre-fill Email ──────────> UI State
                                   Show Form

Create Account ───────────────> Hash Password
  Password                      Create Auth User ────────> Firebase Auth
  Confirm                       Create Profile ──────────> Firestore
                                Update Invite ──────────> Firestore
                                Update Request ─────────> Firestore

Login ────────────────────────> Check Credentials
  Email                        Get User Profile ──────────> Firestore
  Password                      Load into Context

                                                        ─────────────
                                                        All ready!
                                                        ─────────────
```

---

**Architecture Overview Complete!**

These diagrams show:
1. ✅ User registration end-to-end
2. ✅ How authentication protects routes
3. ✅ Admin role validation
4. ✅ Correct database relationships (UID-based)
5. ✅ Loading state handling
6. ✅ Overall data flow

