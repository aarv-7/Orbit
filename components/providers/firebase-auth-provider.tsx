"use client";

import * as React from "react";
import { onAuthStateChanged, signInAnonymously, type User } from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";

interface FirebaseAuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
}

const FirebaseAuthContext = React.createContext<FirebaseAuthContextValue>({
  user: null,
  loading: true,
  configured: false
});

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const configured = isFirebaseConfigured();

  React.useEffect(() => {
    const auth = getFirebaseAuth();

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        return;
      }

      try {
        const credential = await signInAnonymously(auth);
        setUser(credential.user);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = React.useMemo(
    () => ({ user, loading, configured }),
    [configured, loading, user]
  );

  return <FirebaseAuthContext.Provider value={value}>{children}</FirebaseAuthContext.Provider>;
}

export function useFirebaseAuth() {
  return React.useContext(FirebaseAuthContext);
}
