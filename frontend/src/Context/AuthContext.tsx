import React, { createContext, useContext, useEffect, useState } from "react";

type StoredUser = { name: string; email: string; password: string };
type PublicUser = { name: string; email: string } | null;

const USERS_KEY = "bv_users";
const CURRENT_KEY = "bv_current_user";

type RegisterPayload = { name: string; email: string; password: string };
type LoginPayload = { email: string; password: string };

type AuthContextType = {
  user: PublicUser;
  register: (data: RegisterPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PublicUser>(null);

  // load current user from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CURRENT_KEY);
      if (raw) setUser(JSON.parse(raw) as PublicUser);
    } catch {
      setUser(null);
    }
  }, []);

  // seed fake users only if key not present
  useEffect(() => {
    const existing = localStorage.getItem(USERS_KEY);
    if (!existing) {
      const fakeUsers: StoredUser[] = [
        { name: "Long", email: "long@gmail.com", password: "123456" },
        { name: "Mai", email: "mai@gmail.com", password: "654321" },
      ];
      localStorage.setItem(USERS_KEY, JSON.stringify(fakeUsers));
    }
  }, []);

  const register = async ({ name, email, password }: RegisterPayload): Promise<void> => {
    // emulate async behaviour
    await Promise.resolve();

    const raw = localStorage.getItem(USERS_KEY) || "[]";
    const users = JSON.parse(raw) as StoredUser[];

    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error("Email đã được đăng ký");
    }

    users.push({ name, email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  const login = async ({ email, password }: LoginPayload): Promise<void> => {
    // emulate async behaviour
    await Promise.resolve();

    const raw = localStorage.getItem(USERS_KEY) || "[]";
    const users = JSON.parse(raw) as StoredUser[];

    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error("Người dùng không tồn tại");
    }
    if (found.password !== password) {
      throw new Error("Sai email hoặc mật khẩu");
    }

    const publicUser: PublicUser = { name: found.name, email: found.email };
    localStorage.setItem(CURRENT_KEY, JSON.stringify(publicUser));
    setUser(publicUser);
  };

  const logout = () => {
    localStorage.removeItem(CURRENT_KEY);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
