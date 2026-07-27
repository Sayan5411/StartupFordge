import React, { createContext, useContext, useEffect, useState } from "react";
import pb from "@/lib/pocketbaseClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(pb.authStore.record);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(pb.authStore.record);
    setLoading(false);

    const unsubscribe = pb.authStore.onChange((token, record) => {
      setUser(record);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const login = async (identity, password) => {
    const authData = await pb.collection("users").authWithPassword(identity, password);
    setUser(authData.record);
    return authData;
  };

  const oauth = async (provider) => {
    const authData = await pb.collection("users").authWithOAuth2({ provider });
    setUser(authData.record);
    return authData;
  };

  // Only these fields are ever sent on signup. Never spread the raw form
  // object into create() - that would let a client set fields like
  // "verified", "role", or "trustScore" directly and self-escalate.
  const signup = async (data) => {
    const newUser = await pb.collection("users").create({
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm || data.password,
      name: data.name || data.fullName,
      role: data.role,
      headline: data.headline || "",
    });

    if (data.email && data.password) {
      await login(data.email, data.password);
    }

    return newUser;
  };

  const logout = () => {
    pb.authStore.clear();
    setUser(null);
  };

  const isAuthed = !!user && pb.authStore.isValid;

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthed, login, signup, oauth, logout, loading, pb }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};