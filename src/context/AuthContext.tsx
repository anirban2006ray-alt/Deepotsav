import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreErrors';

export interface SavedRangoliItem {
  id: string;
  userId: string;
  title: string;
  symmetry: number;
  color?: string;
  elementsJson: string;
  thumbnailUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SavedECardItem {
  id: string;
  userId: string;
  recipient: string;
  sender: string;
  message: string;
  theme: string;
  previewUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  savedRangolis: SavedRangoliItem[];
  savedECards: SavedECardItem[];
  saveRangoli: (
    data: Omit<SavedRangoliItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => Promise<string>;
  deleteRangoli: (id: string) => Promise<void>;
  saveECard: (
    data: Omit<SavedECardItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => Promise<string>;
  deleteECard: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedRangolis, setSavedRangolis] = useState<SavedRangoliItem[]>([]);
  const [savedECards, setSavedECards] = useState<SavedECardItem[]>([]);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Sync user profile document
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          await setDoc(
            userDocRef,
            {
              uid: currentUser.uid,
              displayName: currentUser.displayName || 'Devotee',
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            { merge: true }
          );
        } catch (error) {
          console.warn('Could not update user profile doc:', error);
        }
      } else {
        setSavedRangolis([]);
        setSavedECards([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time synchronization of Rangolis for authenticated user
  useEffect(() => {
    if (!user) {
      setSavedRangolis([]);
      return;
    }

    const rangoliPath = `users/${user.uid}/rangolis`;
    const q = query(collection(db, rangoliPath));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: SavedRangoliItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as SavedRangoliItem);
        });
        // Sort descending by creation date
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSavedRangolis(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, rangoliPath);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Real-time synchronization of E-Cards for authenticated user
  useEffect(() => {
    if (!user) {
      setSavedECards([]);
      return;
    }

    const ecardsPath = `users/${user.uid}/ecards`;
    const q = query(collection(db, ecardsPath));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items: SavedECardItem[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as SavedECardItem);
        });
        items.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setSavedECards(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, ecardsPath);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error('Google Sign-In failed:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Sign-Out failed:', error);
      throw error;
    }
  };

  const saveRangoli = async (
    data: Omit<SavedRangoliItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    if (!user) {
      throw new Error('Please sign in to save your Rangoli designs.');
    }

    const id = `rangoli_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const path = `users/${user.uid}/rangolis/${id}`;
    const docRef = doc(db, 'users', user.uid, 'rangolis', id);

    const payload: SavedRangoliItem = {
      ...data,
      id,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(docRef, payload);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteRangoli = async (id: string): Promise<void> => {
    if (!user) return;
    const path = `users/${user.uid}/rangolis/${id}`;
    const docRef = doc(db, 'users', user.uid, 'rangolis', id);

    try {
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const saveECard = async (
    data: Omit<SavedECardItem, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<string> => {
    if (!user) {
      throw new Error('Please sign in to save your personalized E-Cards.');
    }

    const id = `ecard_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const path = `users/${user.uid}/ecards/${id}`;
    const docRef = doc(db, 'users', user.uid, 'ecards', id);

    const payload: SavedECardItem = {
      ...data,
      id,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(docRef, payload);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    }
  };

  const deleteECard = async (id: string): Promise<void> => {
    if (!user) return;
    const path = `users/${user.uid}/ecards/${id}`;
    const docRef = doc(db, 'users', user.uid, 'ecards', id);

    try {
      await deleteDoc(docRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signOutUser,
        savedRangolis,
        savedECards,
        saveRangoli,
        deleteRangoli,
        saveECard,
        deleteECard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
