"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  role: "ADMIN" | "USER";
  createdAt: string;
}

interface AuthContextType {
  user: FirebaseUser | null;
  dbUser: DbUser | null;
  loading: boolean;
  syncing: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Sync user with PostgreSQL via API
  const syncUserWithDb = async (firebaseUser: FirebaseUser) => {
    setSyncing(true);
    try {
      const response = await fetch("/api/auth/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: firebaseUser.email,
          name: firebaseUser.displayName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to sync user with database");
      }

      const data = await response.json();
      if (data.success && data.user) {
        setDbUser(data.user);
        
        // Save to localStorage for instant loading on page refreshing
        const localStorageUser = {
          id: data.user.id,
          name: data.user.name || firebaseUser.displayName || "User",
          email: data.user.email,
          avatarUrl: firebaseUser.photoURL || `https://api.dicebear.com/6.x/avataaars/svg?seed=${data.user.name || "User"}`,
          role: data.user.role,
        };
        window.localStorage.setItem("plateslate-user", JSON.stringify(localStorageUser));
      }
    } catch (error) {
      console.error("Database user sync error:", error);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    // Attempt to load from localStorage first for fast initial load
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("plateslate-user");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setDbUser({
            id: parsed.id,
            email: parsed.email,
            name: parsed.name,
            role: parsed.role,
            createdAt: "", // Placeholder
          });
        } catch {
          window.localStorage.removeItem("plateslate-user");
        }
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await syncUserWithDb(firebaseUser);
      } else {
        setDbUser(null);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem("plateslate-user");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setDbUser(null);
      setUser(null);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem("plateslate-user");
      }
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        loading,
        syncing,
        signInWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
