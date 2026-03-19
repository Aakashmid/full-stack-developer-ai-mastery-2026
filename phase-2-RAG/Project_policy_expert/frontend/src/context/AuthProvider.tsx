// frontend/src/context/AuthProvider.tsx
import React, { createContext, useContext, useState } from "react";
import type { SigninPayload, SignupPayload } from "@/types";
import apiClient from "@/utils/apiClient";

/**
 * User type — adjust to match backend response
 */
export type User = {
  pk?: string;
  username?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
};

/**
 * Auth context type
 */
export type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signinAction: (payload: SigninPayload) => Promise<void>;
  signupAction: (payload: SignupPayload) => Promise<void>;
  signoutAction: () => Promise<void>;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Token helpers
 */
const saveTokens = (access?: string, refresh?: string) => {
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
};

const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  /**
   * SIGN IN
   */
  const signinAction = async (payload: SigninPayload): Promise<void> => {
    try {
      const dataToSend = {
        username_or_email: payload.username_or_email, // FIXED
        password: payload.password,
      };

      const res = await apiClient.post(`/auth/login/`, dataToSend);

      const { access, refresh, user: userData } = res.data;

      saveTokens(access, refresh);
      setUser(userData);
    } catch (error: any) {
      console.error("Signin failed:", error?.response?.data || error.message);

      throw new Error(
        error?.response?.data?.detail || "Login failed. Try again."
      );
    }
  };


  /**
   * SIGN UP
   */
  const signupAction = async (payload: SignupPayload): Promise<void> => {
    try {
      const res = await apiClient.post(`/auth/registration/`, payload);
      const { access, refresh, user: userData } = res.data;

      saveTokens(access, refresh);
      setUser(userData);
      
    } catch (error: any) {
      console.error("Signup failed:", error?.response?.data || error.message);

      throw new Error(
        error?.response?.data?.detail || "Signup failed. Try again."
      );
    }
  };


  /**
   * SIGN OUT
   */
  const signoutAction = async (): Promise<void> => {
    try {
      await apiClient.post(`/auth/logout/`);
    } catch (error) {
      // Not critical — proceed anyway
      console.warn("Logout request failed, clearing local state");
    } finally {
      clearTokens();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    signinAction,
    signupAction,
    signoutAction,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

// hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};