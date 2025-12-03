import {
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    limit,
    getDoc,
    setDoc,
    serverTimestamp
} from 'firebase/firestore';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';
import { db, storage } from './firebase';

// --- Events ---

export async function fetchEvents() {
    const q = query(collection(db, 'events'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createEvent(event: any) {
    const docRef = await addDoc(collection(db, 'events'), event);
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() };
}

export async function updateEvent(id: string, payload: any) {
    const docRef = doc(db, 'events', id);
    await updateDoc(docRef, payload);
    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() };
}

export async function deleteEvent(id: string) {
    await deleteDoc(doc(db, 'events', id));
    return true;
}

// --- Attendance ---

export async function fetchAttendance(eventId: string) {
    // Note: This assumes a separate 'attendance' collection. 
    // You might want to structure this as a subcollection of events if appropriate.
    const q = query(collection(db, 'attendance'), where('eventId', '==', eventId), orderBy('time', 'desc'));
    const querySnapshot = await getDocs(q);

    // Fetch member details for each attendance record (manual join)
    const attendanceData = await Promise.all(querySnapshot.docs.map(async (attDoc) => {
        const data = attDoc.data();
        let memberData = null;
        if (data.memberId) {
            const memberSnap = await getDoc(doc(db, 'users', data.memberId));
            if (memberSnap.exists()) {
                memberData = memberSnap.data();
            }
        }
        return { id: attDoc.id, ...data, members: memberData };
    }));

    return attendanceData;
}

export async function fetchAllAttendance() {
    const q = query(collection(db, 'attendance'), orderBy('time', 'desc'));
    const querySnapshot = await getDocs(q);

    // Manual join for members and events
    const data = await Promise.all(querySnapshot.docs.map(async (attDoc) => {
        const d = attDoc.data();
        let memberData = null;
        let eventData = null;

        if (d.memberId) {
            const mSnap = await getDoc(doc(db, 'users', d.memberId));
            if (mSnap.exists()) memberData = mSnap.data();
        }
        if (d.eventId) {
            const eSnap = await getDoc(doc(db, 'events', d.eventId));
            if (eSnap.exists()) eventData = eSnap.data();
        }

        return { id: attDoc.id, ...d, members: memberData, events: eventData };
    }));
    return data;
}

export async function markAttendance(eventId: string, memberId: string) {
    const docRef = await addDoc(collection(db, 'attendance'), {
        eventId,
        memberId,
        time: serverTimestamp()
    });
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() };
}

// --- Members (Profiles) ---

export async function fetchMembers() {
    const q = query(collection(db, 'users'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchMember(id: string) {
    if (id.startsWith('mock-')) {
        return {
            id: id,
            full_name: 'New Member',
            role: 'member',
            avatar_url: '',
            streaks: { current: 0 },
            xp: 0,
            created_at: new Date().toISOString()
        };
    }
    const docRef = doc(db, 'users', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    } else {
        return null;
    }
}

export async function createMember(member: any) {
    // If ID is provided (e.g. from Auth), use setDoc, otherwise addDoc
    if (member.id) {
        await setDoc(doc(db, 'users', member.id), member);
        return member;
    } else {
        const docRef = await addDoc(collection(db, 'users'), member);
        return { id: docRef.id, ...member };
    }
}

export async function updateMember(id: string, payload: any) {
    const docRef = doc(db, 'users', id);
    await updateDoc(docRef, payload);
    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() };
}

export async function deleteMember(id: string) {
    await deleteDoc(doc(db, 'users', id));
    return true;
}

// --- Requests ---

export async function fetchRequests() {
    const q = query(collection(db, 'requests'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateRequestStatus(id: string, status: 'approved' | 'rejected') {
    const docRef = doc(db, 'requests', id);
    await updateDoc(docRef, { status });
    const updatedDoc = await getDoc(docRef);
    return { id: updatedDoc.id, ...updatedDoc.data() };
}

export async function checkApprovedRequest(email: string) {
    const q = query(collection(db, 'requests'), where('email', '==', email), where('status', '==', 'approved'));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    }
    return null;
}

// --- Messages ---

export async function fetchMessages(channelId: string = 'general') {
    const q = query(collection(db, 'messages'), where('channel_id', '==', channelId), orderBy('created_at', 'asc'));
    const querySnapshot = await getDocs(q);

    const messages = await Promise.all(querySnapshot.docs.map(async (msgDoc) => {
        const data = msgDoc.data();
        let senderData = null;
        if (data.sender_id) {
            const userSnap = await getDoc(doc(db, 'users', data.sender_id));
            if (userSnap.exists()) {
                const userData = userSnap.data();
                senderData = { full_name: userData.full_name, avatar_url: userData.avatar_url };
            }
        }
        return { id: msgDoc.id, ...data, members: senderData };
    }));

    return messages;
}

export async function sendMessage(content: string, channelId: string = 'general', userId: string) {
    const docRef = await addDoc(collection(db, 'messages'), {
        content,
        channel_id: channelId,
        sender_id: userId,
        created_at: serverTimestamp()
    });
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() };
}

// Note: Real-time subscription logic needs to be handled in the component using onSnapshot
// or we can export a subscribe function here.
import { onSnapshot } from 'firebase/firestore';

export function subscribeToMessages(channelId: string = 'general', callback: (payload: any) => void) {
    const q = query(collection(db, 'messages'), where('channel_id', '==', channelId), orderBy('created_at', 'asc'));
    return onSnapshot(q, (snapshot) => {
        // Transform snapshot to match expected format if needed, or just pass snapshot
        // For simplicity, let's just re-fetch or pass the changes.
        // However, the original callback expected a specific payload structure.
        // To keep it simple for migration, we might just trigger a re-fetch in the component
        // or pass the new list of messages.

        // Let's try to map it to the list of messages
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    });
}

// --- Gallery ---

export async function fetchAlbums() {
    const q = query(collection(db, 'albums'), orderBy('event_date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function createAlbum(album: any) {
    const docRef = await addDoc(collection(db, 'albums'), album);
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() };
}

export async function deleteAlbum(id: string) {
    await deleteDoc(doc(db, 'albums', id));
    // TODO: Delete associated images from storage
    return true;
}

export async function fetchGalleryImages(albumId?: string) {
    let q;
    if (albumId) {
        q = query(collection(db, 'gallery_images'), where('album_id', '==', albumId), orderBy('created_at', 'desc'));
    } else {
        q = query(collection(db, 'gallery_images'), orderBy('created_at', 'desc'));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function uploadGalleryImage(file: File, albumId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const storageRef = ref(storage, `gallery/${albumId}/${fileName}`);

    await uploadBytes(storageRef, file);
    const publicUrl = await getDownloadURL(storageRef);

    const docRef = await addDoc(collection(db, 'gallery_images'), {
        album_id: albumId,
        url: publicUrl,
        created_at: serverTimestamp()
    });

    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...(newDoc.data() || {}) };
}

export async function deleteGalleryImage(id: string, url: string) {
    // Extract path from URL? Firebase URLs are different.
    // It's safer to store the storage path in the DB, but for now let's try to parse or just delete the doc.
    // Ideally we should have stored the storage path.

    // Attempt to get reference from URL
    try {
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
    } catch (e) {
        console.warn("Failed to delete from storage", e);
    }

    await deleteDoc(doc(db, 'gallery_images', id));
    return true;
}

// --- Leaderboard ---

export async function fetchLeaderboard() {
    // Manual aggregation as Firestore doesn't support complex joins/views easily without extensions
    const usersSnap = await getDocs(collection(db, 'users'));
    const projectsSnap = await getDocs(collection(db, 'projects'));

    const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() as any }));
    const projects = projectsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const stats = users.map((user: any) => {
        const count = projects.filter((p: any) => p.user_id === user.id).length;
        return {
            user_id: user.id,
            full_name: user.full_name,
            avatar_url: user.avatar_url,
            project_count: count,
            score: count * 10
        };
    });

    return stats.sort((a, b) => b.score - a.score);
}

// --- Member Dashboard ---

export async function fetchUserProjects(userId: string) {
    const q = query(collection(db, 'projects'), where('user_id', '==', userId), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchUserLogs(userId: string) {
    const q = query(collection(db, 'learning_logs'), where('user_id', '==', userId), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchUserNotifications(userId: string) {
    const q = query(collection(db, 'notifications'), where('user_id', '==', userId), orderBy('created_at', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function fetchProjects() {
    const q = query(collection(db, 'projects'), orderBy('created_at', 'desc'));
    const querySnapshot = await getDocs(q);

    const projects = await Promise.all(querySnapshot.docs.map(async (pDoc) => {
        const data = pDoc.data();
        let profileData = null;
        if (data.user_id) {
            const uSnap = await getDoc(doc(db, 'users', data.user_id));
            if (uSnap.exists()) {
                const uData = uSnap.data();
                profileData = { full_name: uData.full_name, avatar_url: uData.avatar_url };
            }
        }
        return { id: pDoc.id, ...data, profiles: profileData };
    }));

    return projects;
}

export async function createProject(project: any) {
    const docRef = await addDoc(collection(db, 'projects'), { ...project, created_at: serverTimestamp() });
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() };
}

export async function createLog(log: any) {
    const docRef = await addDoc(collection(db, 'learning_logs'), { ...log, created_at: serverTimestamp() });
    const newDoc = await getDoc(docRef);
    return { id: newDoc.id, ...newDoc.data() };
}
