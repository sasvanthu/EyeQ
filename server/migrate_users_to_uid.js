/*
  Migration script: Move email-keyed user documents to UID-based documents.

  Usage:
    - Place serviceAccountKey.json in server/
    - Set FIREBASE_PROJECT_ID env var if needed
    - Run: node migrate_users_to_uid.js

  Behavior:
    - For each document in `users/` collection, attempts to find an auth user by the `email` field.
    - If a matching auth user exists and there's not already a `users/{uid}` document, copies the doc to the uid path and deletes the old doc.
    - Logs actions; safe-guards included.
*/

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceKeyPath = path.join(__dirname, 'serviceAccountKey.json');
if (!fs.existsSync(serviceKeyPath)) {
  console.error('serviceAccountKey.json not found in server/. Place your service account JSON there and re-run.');
  process.exit(1);
}

admin.initializeApp({ credential: admin.credential.cert(require(serviceKeyPath)) });
const db = admin.firestore();

async function migrate() {
  console.log('Starting migration: users -> uid-based docs');
  const usersSnap = await db.collection('users').get();
  console.log(`Found ${usersSnap.size} user documents`);

  for (const doc of usersSnap.docs) {
    const id = doc.id;
    const data = doc.data();
    // If ID looks like a UID (length >= 20 and contains letters/numbers), skip
    if (id.length >= 20 && id.includes('-') === false) {
      console.log(`Skipping doc ${id} (looks like UID)`);
      continue;
    }

    const email = data.email;
    if (!email) {
      console.log(`Skipping ${id}: no email field`);
      continue;
    }

    try {
      const userRecord = await admin.auth().getUserByEmail(email);
      const uid = userRecord.uid;
      const targetDocRef = db.collection('users').doc(uid);
      const targetSnap = await targetDocRef.get();
      if (targetSnap.exists) {
        console.log(`Target users/${uid} already exists — skipping copy for ${id}`);
        // Optionally delete old doc if desired
        // await db.collection('users').doc(id).delete();
        continue;
      }

      // Copy data and set id to uid
      const newData = { ...data, id: uid };
      await targetDocRef.set(newData);
      console.log(`Copied users/${id} -> users/${uid}`);

      // Delete old doc
      await db.collection('users').doc(id).delete();
      console.log(`Deleted old doc users/${id}`);
    } catch (err) {
      if (err.code === 'auth/user-not-found') {
        console.log(`No auth user for email ${email} (doc ${id}) — skipping`);
      } else {
        console.error('Error processing', id, err);
      }
    }
  }

  console.log('Migration complete');
}

migrate().catch(err => {
  console.error('Migration failed', err);
  process.exit(1);
});
