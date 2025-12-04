# 🚀 QUICK START GUIDE

## Get Started in 5 Minutes

### Step 1: Prepare Backend (2 mins)

```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Download from Firebase Console:
# 1. Go to https://console.firebase.google.com
# 2. Select your project
# 3. Project Settings (gear icon) → Service Accounts
# 4. Click "Generate New Private Key"
# 5. Save the JSON file as "serviceAccountKey.json" here

# Verify it's in the right place:
# server/serviceAccountKey.json (should exist)

# Start backend server
npm start
# Should show: "Certificate server running on port 4000"
```

### Step 2: Run Frontend (1 min)

```bash
# Back in root directory
cd ..

# Start dev server
npm run dev
# Should show: "Local: http://localhost:5173"
```

### Step 3: Test the Flow (2 mins)

**Open in Browser**: http://localhost:5173

```
1. Go to /join-us
2. Fill form:
   - Name: "Test User"
   - Email: "test@example.com"
   - Department: "Engineering"
   - Skills: ["React"]
3. Click "Submit Request"
4. Go to /admin/login
5. Login (use your admin credentials)
6. Find pending request
7. Click "Send Invite"
8. Copy invite link
9. Open link in incognito/new tab
10. Email should be pre-filled
11. Set password and create account
12. You're logged in! ✅
```

---

## Verify It Works

### Check 1: User Created
```
Firefox DevTools → Open: http://localhost:5173/dashboard
Should see your profile loaded
```

### Check 2: Database Has It
```
Firebase Console → Firestore → users/
Should see a document with your Firebase UID as ID
```

### Check 3: No Errors
```
Browser Console (F12):
Should be clean, no red errors
```

---

## Common Quick Fixes

### "Backend not responding"
```bash
# Make sure you're in server/ folder
cd server
npm start
```

### "Firebase initialization failed"
```
1. Check serviceAccountKey.json exists in server/
2. Restart npm start
3. Check Firebase credentials are valid
```

### "Invite invalid error"
```
1. Backend must be running on port 4000
2. Check Firestore has invite in invites/ collection
3. Token expiry should be future date
```

### "Email already in use"
```
1. Go to Firebase Console → Authentication
2. Delete test user from Auth tab
3. Try signup again
```

---

## Helpful Commands

```bash
# Start backend
cd server && npm start

# Start frontend
cd .. && npm run dev

# Clear browser cache
Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)

# View Firebase logs
tail -f server.log

# Check if ports are free
# Port 4000 (backend)
# Port 5173 (frontend)

# Kill process on port 4000
lsof -i :4000  # Find PID
kill -9 <PID>  # Kill it

# Test backend
curl http://localhost:4000/api/health
```

---

## File Locations to Know

| What | Where |
|------|-------|
| Main App | `src/App.tsx` |
| Auth System | `src/lib/auth.tsx` |
| Database | `src/lib/api.ts` |
| Login | `src/pages/auth/Login.tsx` |
| Signup | `src/pages/auth/SignUp.tsx` |
| Admin | `src/pages/admin/MemberApproval.tsx` |
| Backend | `server/index.js` |
| Docs | `SUMMARY.md`, `TESTING_GUIDE.md`, etc |

---

## Troubleshooting

### Problem: "Can't find serviceAccountKey.json"
**Solution**: File must be in `server/` folder, not elsewhere
```
EyeQ/
├── server/
│   ├── index.js
│   ├── package.json
│   └── serviceAccountKey.json  ← HERE
```

### Problem: "Invite link doesn't work"
**Solution**: Check these steps:
1. Backend running? `curl http://localhost:4000/api/health`
2. Token in Firestore? Firebase Console → invites/
3. Not expired? Check `expires_at` timestamp
4. Link format correct? `/signup?invite=TOKEN`

### Problem: "Login keeps redirecting"
**Solution**: 
1. Check Auth context loads properly
2. Clear browser cache (Ctrl+Shift+Delete)
3. Check user exists in Firebase Auth
4. Check profile exists in Firestore

### Problem: "CORS errors in console"
**Solution**:
1. Backend must be running
2. Correct port (4000)
3. CORS enabled in server/index.js ✓

---

## What to Do If It Breaks

### Step 1: Check Console Errors
```
Browser DevTools → Console tab
Look for red error messages
Search: "auth", "firebase", "firestore"
```

### Step 2: Check Backend
```bash
curl http://localhost:4000/api/health
# Should return JSON with status: 'ok'

# If not, backend isn't running
# Restart: cd server && npm start
```

### Step 3: Check Firebase
```
Firebase Console:
1. Authentication → Check users exist
2. Firestore → Check documents exist
3. Check security rules allow reads/writes
```

### Step 4: Check Logs
```bash
# Backend logs
# Should show requests hitting endpoints

# Browser console (F12)
# Should be clean

# Network tab (F12 → Network)
# Check request/response status codes
```

---

## Success Signs ✅

- [x] Backend starts without errors
- [x] Frontend loads at localhost:5173
- [x] Can submit a request form
- [x] Admin can see pending requests
- [x] Can send invite
- [x] Invite link works
- [x] Email pre-filled on signup
- [x] Can create account
- [x] Dashboard loads after signup
- [x] No red errors in console
- [x] Firestore has user document
- [x] Firebase Auth has user

---

## Next Steps After Testing

1. ✅ Verify everything works
2. ✅ Read IMPLEMENTATION_COMPLETE.md for details
3. ✅ Update Firestore security rules
4. ✅ Consider production deployment
5. ✅ Set up CI/CD pipeline
6. ✅ Monitor Firebase usage

---

## Documentation Quick Links

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **SUMMARY.md** | Overview & setup | 5 min |
| **TESTING_GUIDE.md** | Test scenarios | 15 min |
| **IMPLEMENTATION_COMPLETE.md** | Technical details | 20 min |
| **ARCHITECTURE_DIAGRAMS.md** | Visual flows | 10 min |
| **SETUP_CHECKLIST.md** | Checklist format | 5 min |
| **CHANGES_LOG.md** | Line-by-line changes | 10 min |

---

## Emergency Reset

If you need to start fresh:

```bash
# Delete test data from Firebase
Firebase Console → Firestore → Delete users collection
Firebase Console → Authentication → Delete test users

# Clear browser cache
Ctrl+Shift+Delete

# Restart servers
Ctrl+C in both terminal windows
cd server && npm start  # Terminal 1
cd .. && npm run dev     # Terminal 2 (new window)
```

---

## Support

If you get stuck:
1. Check TESTING_GUIDE.md for specific test scenarios
2. Check IMPLEMENTATION_COMPLETE.md for technical details
3. Look at browser console for error messages
4. Check Firebase Console for data issues
5. Verify backend is running (port 4000)

---

**You're ready to go! 🎉**

```
🚀 Start here:
1. cd server && npm start
2. cd .. && npm run dev
3. http://localhost:5173/join-us
4. Follow TESTING_GUIDE.md
```

**Questions?** → Check documentation files in project root
