import React, { useState, useEffect } from 'react';
import { uploadUserAvatar } from '../lib/api';
import { useAuth } from '../lib/auth';

export default function AvatarUploader() {
    const { user, refreshProfile } = useAuth();
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file]);

    if (!user) return <div>Please login to upload an avatar.</div>;

    async function handleUpload() {
        if (!file) return setMessage('No file selected');
        setLoading(true);
        setMessage(null);
            try {
            const res = await uploadUserAvatar(user.uid, file);
            // Refresh profile in auth context so UI updates with new avatar_url
            if (refreshProfile) await refreshProfile();
            setMessage('Upload successful');
        } catch (err: any) {
            setMessage(err.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="avatar-uploader">
            <label className="block mb-2">Choose avatar</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
            {preview && <img src={preview} alt="preview" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />}
            <div style={{ marginTop: 8 }}>
                <button onClick={handleUpload} disabled={loading || !file} className="btn">
                    {loading ? 'Uploading...' : 'Upload Avatar'}
                </button>
            </div>
            {message && <div style={{ marginTop: 8 }}>{message}</div>}
        </div>
    );
}
