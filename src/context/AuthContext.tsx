// AuthContext: Provides authentication state globally across the app
// Uses Firebase Auth with onAuthStateChanged for persistent login

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../services/firebase';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface AuthContextType {
  currentUser: User | null;     // The logged-in Firebase user (null if not logged in)
  loading: boolean;             // True while Firebase checks auth state on mount
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

// ─── Context Creation ──────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider Component ────────────────────────────────────────────────────────

/**
 * Wrap your entire app with <AuthProvider> so all children can
 * call useAuth() to access the current user and auth methods.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // loading = true means we're still waiting for Firebase to confirm login status
  const [loading, setLoading] = useState(true);

  // Sign up a new user with email and password
  const signup = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  // Log in an existing user
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Log out the current user
  const logout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    // Firebase persists auth state automatically (local storage by default).
    // onAuthStateChanged fires on every auth state change (login/logout/refresh).
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Done checking — show the app
    });

    // Cleanup: unsubscribe listener when AuthProvider unmounts
    return unsubscribe;
  }, []);

  const value: AuthContextType = { currentUser, loading, signup, login, logout };

  // Don't render children until we know the auth state (prevents flash of wrong page)
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ─── Custom Hook ───────────────────────────────────────────────────────────────

/**
 * useAuth() — call this in any component to access:
 *   currentUser, loading, signup, login, logout
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
};
