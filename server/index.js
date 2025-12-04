import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '5mb' }));

// Initialize Firebase Admin SDK
// Make sure you have a serviceAccountKey.json file in the server directory
// Download from Firebase Console > Project Settings > Service Accounts
try {
  const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL || ''
    });
  } else {
    console.warn('serviceAccountKey.json not found. Firebase Admin endpoints will not work.');
  }
} catch (err) {
  console.warn('Error initializing Firebase Admin:', err.message);
}

// Helper: simple admin auth middleware for server endpoints.
// Set environment variable ADMIN_API_KEY to protect admin endpoints.
function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key'] || req.query.admin_key;
  if (process.env.ADMIN_API_KEY && key === process.env.ADMIN_API_KEY) {
    return next();
  }
  // If Firebase Admin is initialized, optionally allow requests from localhost when no key provided
  if (!process.env.ADMIN_API_KEY && process.env.NODE_ENV !== 'production') {
    return next();
  }
  return res.status(403).json({ error: 'Admin API key required' });
}

// Firestore reference (if admin initialized)
const firestore = admin.apps && admin.apps.length ? admin.firestore() : null;

app.post('/generate-certificate', async (req, res) => {
  try {
    const { eventTitle, memberName, date } = req.body;
    const html = `
      <html>
        <head>
          <meta charset='utf-8' />
          <style>
            body{ background:#000; color:#fff; font-family: Arial, sans-serif;}
            .cert{ border: 6px solid #00D1FF; padding: 60px; border-radius: 12px; text-align: center; }
            h1 { font-size: 28px; }
            h2 { font-size: 22px; margin-top: 20px; }
            .meta { margin-top: 20px; font-size: 14px; color: #dbeefd; }
          </style>
        </head>
        <body>
          <div class='cert'>
            <h1>Certificate of Participation</h1>
            <h2>${eventTitle}</h2>
            <div class='meta'>Presented to</div>
            <h2 style='margin-top: 20px;'>${memberName}</h2>
            <div class='meta'>Date: ${date}</div>
          </div>
        </body>
      </html>
    `;

    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdfBuffer.length });
    res.send(pdfBuffer);
  } catch (err) {
    console.error('PDF generation failed:', err);
    res.status(500).json({ error: 'PDF generation failed', details: String(err) });
  }
});

const port = process.env.PORT || 4000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Certificate server running on port ${port}`);
  });
}

export default app;

// --- FIREBASE ADMIN ENDPOINTS ---

/**
 * POST /api/invites/send
 * Send invitation to a new user and create Firebase Auth user
 * Requires: admin authentication via custom headers or middleware
 */
app.post('/api/invites/send', async (req, res) => {
  try {
    const { email, fullName, requestId } = req.body;

    if (!email || !fullName) {
      return res.status(400).json({
        error: 'Missing required fields: email, fullName'
      });
    }

    // Prefer creating an invite document in Firestore and returning a token/link.
    // If admin wants to create an auth user immediately, pass `createAuthUser: true` in body.

    // Ensure Firestore is available
    if (!firestore) {
      return res.status(500).json({ error: 'Firebase Admin Firestore not configured. Please upload serviceAccountKey.json' });
    }

    // If admin requested immediate auth user creation, fall back to previous behaviour.
    if (req.body.createAuthUser) {
      // Create Firebase Auth user with temporary password
      const tempPassword = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      // Check if user exists
      try {
        await admin.auth().getUserByEmail(email);
        return res.status(400).json({ error: 'User with this email already exists' });
      } catch (err) {
        if (err.code !== 'auth/user-not-found') throw err;
      }

      const userRecord = await admin.auth().createUser({ email, password: tempPassword, displayName: fullName, emailVerified: false });
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'member', pending: true });
      return res.json({ success: true, createdAuthUser: true, user: { uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName } });
    }

    // Otherwise create an invite token in Firestore
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const inviteDoc = {
      email,
      fullName: fullName || null,
      request_id: requestId || null,
      token,
      created_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      used: false
    };

    await firestore.collection('invites').doc(token).set(inviteDoc);

    const signupLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/signup?invite=${token}`;

    return res.json({ success: true, invite: inviteDoc, signupLink });

  } catch (error) {
    console.error('Error creating auth user:', error);
    res.status(500).json({
      error: 'Failed to create user',
      details: error.message
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    firebaseAdminReady: !!admin.auth
  });
});

/**
 * GET /api/invites/validate/:token
 * Validate an invite token and return invite data if valid
 */
app.get('/api/invites/validate/:token', async (req, res) => {
  try {
    const { token } = req.params;
    if (!firestore) return res.status(500).json({ error: 'Firestore not configured' });

    const doc = await firestore.collection('invites').doc(token).get();
    if (!doc.exists) return res.status(404).json({ valid: false, error: 'Invite not found' });

    const data = doc.data();
    if (data.used) return res.status(400).json({ valid: false, error: 'Invite already used' });
    const expiresAt = new Date(data.expires_at);
    if (new Date() > expiresAt) return res.status(400).json({ valid: false, error: 'Invite expired' });

    return res.json({ valid: true, invite: data });
  } catch (err) {
    console.error('Invite validate error:', err);
    res.status(500).json({ error: 'Invite validation failed' });
  }
});

/**
 * POST /api/invites/create-user
 * Create a Firebase Auth user from an invite token (admin-only)
 */
app.post('/api/invites/create-user', requireAdmin, async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token) return res.status(400).json({ error: 'token required' });
    if (!firestore) return res.status(500).json({ error: 'Firestore not configured' });

    const docRef = firestore.collection('invites').doc(token);
    const snap = await docRef.get();
    if (!snap.exists) return res.status(404).json({ error: 'Invite not found' });
    const invite = snap.data();
    if (invite.used) return res.status(400).json({ error: 'Invite already used' });
    const expiresAt = new Date(invite.expires_at);
    if (new Date() > expiresAt) return res.status(400).json({ error: 'Invite expired' });

    // Create user
    const tempPassword = password || (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    // Ensure user does not exist
    try {
      await admin.auth().getUserByEmail(invite.email);
      return res.status(400).json({ error: 'User with this email already exists' });
    } catch (err) {
      if (err.code !== 'auth/user-not-found') throw err;
    }

    const userRecord = await admin.auth().createUser({ email: invite.email, password: tempPassword, displayName: invite.fullName || undefined });
    await admin.auth().setCustomUserClaims(userRecord.uid, { role: 'member' });

    // mark invite used
    await docRef.update({ used: true });

    return res.json({ success: true, user: { uid: userRecord.uid, email: userRecord.email, displayName: userRecord.displayName } });
  } catch (err) {
    console.error('create-user-from-invite error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

/**
 * POST /api/admin/set-claim
 * Set custom claim (e.g., admin) for a user. Protected by admin API key.
 */
app.post('/api/admin/set-claim', requireAdmin, async (req, res) => {
  try {
    const { uid, claimKey, claimValue } = req.body;
    if (!uid || !claimKey) return res.status(400).json({ error: 'uid and claimKey are required' });
    const claims = {};
    claims[claimKey] = claimValue === undefined ? true : claimValue;
    await admin.auth().setCustomUserClaims(uid, claims);
    return res.json({ success: true });
  } catch (err) {
    console.error('set-claim error:', err);
    res.status(500).json({ error: 'Failed to set claim' });
  }
});
