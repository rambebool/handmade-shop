"use client";

import { useState } from "react";
import { User, UserRole } from "@/lib/types";
import { getUsers, updateUserRole, deleteUser } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";

const ROLE_OPTIONS: { value: UserRole; label: string }[] = [
  { value: "user", label: "Пользователь" },
  { value: "moderator", label: "Модератор" },
  { value: "admin", label: "Администратор" },
];

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>(() => getUsers());
  const [message, setMessage] = useState("");

  const flash = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateUserRole(userId, role);
    setUsers(getUsers());
    flash("Роль изменена");
  };

  const handleDelete = (userId: string) => {
    if (userId === currentUser?.id) { alert("Нельзя удалить самого себя"); return; }
    if (!confirm("Удалить пользователя?")) return;
    deleteUser(userId);
    setUsers(getUsers());
    flash("Пользователь удалён");
  };

  return (
    <div className="space-y-4">
      {message && (
        <div className="border-2 border-black/80 bg-[#00E5FF] px-4 py-2 font-mono text-sm font-bold">
          {message}
        </div>
      )}

      <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
        <h2 className="mb-4 font-mono text-lg font-black uppercase">
          Пользователи ({users.length})
        </h2>

        <div className="space-y-3">
          {users.map((u) => (
            <div
              key={u.id}
              className={`flex flex-wrap items-center gap-3 border-2 p-3 ${
                u.id === currentUser?.id ? "border-[#FF4D00] bg-orange-50" : "border-gray-200"
              }`}
            >
              <div className="flex-1 min-w-[200px]">
                <p className="font-mono text-sm font-bold">
                  {u.displayName || u.login}
                  {u.id === currentUser?.id && (
                    <span className="ml-2 text-xs text-[#FF4D00]">(вы)</span>
                  )}
                </p>
                <p className="font-mono text-xs text-gray-500">
                  @{u.login} {u.email && `• ${u.email}`} • {new Date(u.createdAt).toLocaleDateString("ru-RU")}
                </p>
              </div>

              <select
                value={u.role}
                onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                disabled={u.id === currentUser?.id}
                className="border-2 border-black/80 bg-white px-2 py-1 font-mono text-xs disabled:bg-gray-100"
              >
                {ROLE_OPTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>

              <button
                onClick={() => handleDelete(u.id)}
                disabled={u.id === currentUser?.id}
                className="border-2 border-red-500 px-2 py-1 font-mono text-xs font-bold text-red-500 transition-all hover:bg-red-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
