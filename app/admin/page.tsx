"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import AdminForm from "@/components/AdminForm";
import AdminUsers from "@/components/AdminUsers";
import AdminCategories from "@/components/AdminCategories";
import AdminAds from "@/components/AdminAds";
import AdminSettings from "@/components/AdminSettings";
import AdminStats from "@/components/AdminStats";

type AdminTab = "products" | "categories" | "users" | "ads" | "settings" | "stats";

const TABS: { id: AdminTab; label: string; minRole: "moderator" | "admin" }[] = [
  { id: "products", label: "Товары", minRole: "moderator" },
  { id: "categories", label: "Категории", minRole: "moderator" },
  { id: "users", label: "Пользователи", minRole: "admin" },
  { id: "ads", label: "Реклама", minRole: "admin" },
  { id: "settings", label: "Настройки", minRole: "admin" },
  { id: "stats", label: "Статистика", minRole: "moderator" },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<AdminTab>("products");

  useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "moderator"))) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;
  if (user.role !== "admin" && user.role !== "moderator") return null;

  const visibleTabs = TABS.filter((t) => {
    if (t.minRole === "admin" && user.role !== "admin") return false;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl font-black uppercase text-[#1A1A1A] md:text-4xl">
            Админ-панель
          </h1>
          <p className="mt-1 font-mono text-sm text-gray-500">
            {user.role === "admin" ? "Администратор" : "Модератор"}: {user.displayName || user.login}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex flex-wrap gap-1">
        {visibleTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`border-2 px-4 py-2 font-mono text-xs font-bold uppercase transition-all ${
              tab === t.id
                ? "border-black/80 bg-[#FF4D00] text-white shadow-[2px_2px_0px_#1A1A1A]"
                : "border-black/40 bg-white text-[#1A1A1A] hover:border-black/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "products" && <AdminForm />}
      {tab === "categories" && <AdminCategories />}
      {tab === "users" && user.role === "admin" && <AdminUsers />}
      {tab === "ads" && user.role === "admin" && <AdminAds />}
      {tab === "settings" && user.role === "admin" && <AdminSettings />}
      {tab === "stats" && <AdminStats />}
    </div>
  );
}
