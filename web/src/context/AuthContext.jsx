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

  const signup = async (data) => {
    const newUser = await pb.collection("users").create({
      email: data.email,
      password: data.password,
      passwordConfirm: data.passwordConfirm || data.password,
      name: data.name || data.fullName,
      role: data.role,
      ...data,
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

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading, pb }}>
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
