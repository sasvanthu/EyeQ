import React, { useState } from 'react';
import { uploadUserPhoto } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function PhotoUploader({ onComplete }: { onComplete?: (doc: any) => void }) {
    const { user } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [caption, setCaption] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    if (!user) return <div>Please login to upload a photo.</div>;

    async function handleUpload() {
        if (!file) return setMessage('No file selected');
        setLoading(true);
        setMessage(null);
        try {
            const doc = await uploadUserPhoto(user.uid, file, caption);
            setMessage('Photo uploaded');
            setFile(null);
            setCaption('');
            if (onComplete) onComplete(doc);
        } catch (err: any) {
            setMessage(err.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="photo-uploader">
            <label className="block mb-2">Select photo</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
            <textarea placeholder="Caption (optional)" value={caption} onChange={e => setCaption(e.target.value)} />
            <div>
                <button onClick={handleUpload} disabled={loading || !file} className="btn">
                    {loading ? 'Uploading...' : 'Upload Photo'}
                </button>
            </div>
            {message && <div style={{ marginTop: 8 }}>{message}</div>}
        </div>
    );
}
