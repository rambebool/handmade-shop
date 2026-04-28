"use client";

import { User, AuthSession, UserRole } from "./types";

const USERS_KEY = "handmade-shop-users";
const SESSION_KEY = "handmade-shop-session";

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = ((hash << 5) - hash + ch) | 0;
  }
  const a = Math.abs(hash).toString(36);
  let hash2 = 5381;
  for (let i = 0; i < str.length; i++) {
    hash2 = (hash2 * 33) ^ str.charCodeAt(i);
  }
  const b = Math.abs(hash2).toString(36);
  return `${a}$${b}`;
}

function generateToken(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

export function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (new Date(session.expiresAt) < new Date()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function getCurrentUser(): User | null {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  return users.find((u) => u.id === session.userId) || null;
}

export function hasAdminSetup(): boolean {
  const users = getUsers();
  return users.some((u) => u.role === "admin");
}

export function register(
  login: string,
  password: string,
  email?: string,
  role?: UserRole
): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  if (users.some((u) => u.login.toLowerCase() === login.toLowerCase())) {
    return { success: false, error: "Пользователь с таким логином уже существует" };
  }

  const user: User = {
    id: `user-${Date.now()}`,
    login,
    passwordHash: simpleHash(password),
    email: email || undefined,
    role: role || "user",
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  saveUsers(users);

  const session: AuthSession = {
    userId: user.id,
    token: generateToken(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("auth-update"));

  return { success: true, user };
}

export function login(
  loginStr: string,
  password: string
): { success: boolean; error?: string; user?: User } {
  const users = getUsers();
  const user = users.find(
    (u) => u.login.toLowerCase() === loginStr.toLowerCase()
  );
  if (!user) {
    return { success: false, error: "Пользователь не найден" };
  }
  if (user.passwordHash !== simpleHash(password)) {
    return { success: false, error: "Неверный пароль" };
  }

  const session: AuthSession = {
    userId: user.id,
    token: generateToken(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("auth-update"));

  return { success: true, user };
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("auth-update"));
}

export function updateUser(userId: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return null;
  users[idx] = { ...users[idx], ...updates, passwordHash: users[idx].passwordHash };
  saveUsers(users);
  window.dispatchEvent(new Event("auth-update"));
  return users[idx];
}

export function updateUserRole(userId: string, role: UserRole): User | null {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return null;
  users[idx].role = role;
  saveUsers(users);
  window.dispatchEvent(new Event("auth-update"));
  return users[idx];
}

export function changePassword(userId: string, oldPassword: string, newPassword: string): { success: boolean; error?: string } {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx < 0) return { success: false, error: "Пользователь не найден" };
  if (users[idx].passwordHash !== simpleHash(oldPassword)) {
    return { success: false, error: "Неверный текущий пароль" };
  }
  users[idx].passwordHash = simpleHash(newPassword);
  saveUsers(users);
  return { success: true };
}

export function deleteUser(userId: string): void {
  const users = getUsers().filter((u) => u.id !== userId);
  saveUsers(users);
  window.dispatchEvent(new Event("auth-update"));
}

export function isAdmin(user: User | null): boolean {
  return user?.role === "admin";
}

export function isModerator(user: User | null): boolean {
  return user?.role === "moderator" || user?.role === "admin";
}
