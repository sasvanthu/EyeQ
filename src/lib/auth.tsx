import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Subscribe to user profile changes
        if (unsubscribeProfile) unsubscribeProfile();

        const docRef = doc(db, 'users', currentUser.uid);
        unsubscribeProfile = onSnapshot(docRef,
          (docSnap) => {
            if (docSnap.exists()) {
              setProfile(docSnap.data());
            } else {
              // First login: auto-create profile
              const newProfile = {
                id: currentUser.uid,
                full_name: currentUser.displayName || '',
                email: currentUser.email || '',
                role: 'member',
                avatar_url: '',
                created_at: new Date().toISOString(),
                streaks: { current: 0 },
                xp: 0
              };

              // We don't await this here to avoid blocking, but we set local state
              setDoc(doc(db, 'users', currentUser.uid), newProfile)
                .then(() => console.log('Profile created'))
                .catch(err => console.error('Error creating profile:', err));

              setProfile(newProfile);
            }
            setLoading(false);
          },
          (err) => {
            console.error('Error listening to profile:', err);
            setLoading(false);
          }
        );
      } else {
        // Logged out
        setUser(null);
        setProfile(null);
        setLoading(false);
        if (unsubscribeProfile) {
          unsubscribeProfile();
          unsubscribeProfile = null;
        }
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  // Kept for compatibility, but now just wraps the internal state update if needed, 
  // though onSnapshot handles it automatically.
  const fetchProfile = async (userId: string) => {
    // No-op: handled by onSnapshot
    return;
  };

  const refreshProfile = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      await fetchProfile(currentUser.uid);
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setProfile(null);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



