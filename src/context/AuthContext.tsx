"use client";

import React, { createContext, useContext, useState, useSyncExternalStore, useEffect } from "react";
import { UserAccount, UserRole, RoleMeta } from "@/types";
import { DEFAULT_USERS, ROLE_METADATA } from "@/lib/mock-data/users";
import { loginWithSupabase, signupWithSupabase } from "@/lib/services/userService";

interface AuthContextType {
  currentUser: UserAccount | null;
  isAuthenticated: boolean;
  currentRoleMeta: RoleMeta | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, fullName: string, role?: UserRole) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const subscribe = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener("modesy_auth", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("modesy_auth", callback);
  };
};

const getSnapshot = (): string => {
  if (typeof window === "undefined") return "superadmin";
  return localStorage.getItem("modesy_active_role") || "superadmin";
};

const getServerSnapshot = (): string => "superadmin";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const activeRoleStr = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const setRole = (role: string, user?: UserAccount) => {
    localStorage.setItem("modesy_active_role", role);
    if (user) setCurrentUser(user);
    window.dispatchEvent(new Event("modesy_auth"));
  };

  // Load user from Supabase on mount
  useEffect(() => {
    const initAuth = async () => {
      if (activeRoleStr !== "logged_out" && activeRoleStr !== "superadmin") {
        try {
          const supabase = (await import("@/lib/supabase/client")).getSupabaseClient();
          if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const { data: profile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single();
              if (profile) {
                setCurrentUser({
                  id: profile.id,
                  email: profile.email,
                  username: profile.username || user.email!.split("@")[0],
                  fullName: profile.full_name || user.user_metadata.full_name || "User",
                  role: profile.role as UserRole,
                  avatarUrl: profile.avatar_url,
                  phoneNumber: profile.phone_number,
                  storeName: profile.store_name,
                  createdAt: profile.created_at,
                  password: "", // Dummy password for Supabase users
                });
              }
            }
          }
        } catch (e) {
          console.warn("Failed to load user from Supabase:", e);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, [activeRoleStr]);

  // Fallback to mock data if no Supabase user
  const fallbackUser = activeRoleStr === "logged_out"
    ? null
    : DEFAULT_USERS.find((u) => u.role === (activeRoleStr as UserRole)) ?? DEFAULT_USERS[0];

  const user = currentUser || fallbackUser;

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Attempting login for:", email);
      const { user: authUser, error } = await loginWithSupabase(email, pass);
      console.log("Supabase login result:", { authUser, error });
      if (error || !authUser) {
        // Fallback to mock data
        console.log("Falling back to mock data");
        const found = DEFAULT_USERS.find(
          (u) =>
            (u.email.toLowerCase() === email.trim().toLowerCase() ||
             u.username.toLowerCase() === email.trim().toLowerCase()) &&
            u.password === pass.trim()
        );
        if (found) {
          console.log("Mock login success:", found.role);
          setRole(found.role, found);
          setIsLoginModalOpen(false);
          setIsLoading(false);
          return true;
        }
        console.log("Mock login failed - user not found");
        setIsLoading(false);
        return false;
      }
      console.log("Supabase login success:", authUser.role);
      setRole(authUser.role, authUser);
      setIsLoginModalOpen(false);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error("Login error:", e);
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (email: string, pass: string, fullName: string, role: UserRole = "member"): Promise<boolean> => {
    setIsLoading(true);
    try {
      console.log("Attempting signup for:", email);
      const { user: authUser, error } = await signupWithSupabase(email, pass, fullName, role);
      console.log("Supabase signup result:", { authUser, error });
      if (error || !authUser) {
        setIsLoading(false);
        return false;
      }
      console.log("Supabase signup success:", authUser.role);
      setRole(authUser.role, authUser);
      setIsLoginModalOpen(false);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error("Signup error:", e);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setRole("logged_out");
    setCurrentUser(null);
    // Also sign out from Supabase
    import("@/lib/supabase/client").then(({ getSupabaseClient }) => {
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.auth.signOut();
      }
    });
  };

  const currentRoleMeta = user ? ROLE_METADATA[user.role] : null;

  return (
    <AuthContext.Provider
      value={{
        currentUser: user,
        isAuthenticated: !!user,
        currentRoleMeta,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
