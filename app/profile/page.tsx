"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { updateUser, changePassword } from "@/lib/auth";
import { getUserOrders } from "@/lib/store";
import { Order } from "@/lib/types";

const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Ожидает",
  processing: "В обработке",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-500",
  processing: "bg-blue-50 text-blue-700 border-blue-500",
  shipped: "bg-purple-50 text-purple-700 border-purple-500",
  delivered: "bg-green-50 text-green-700 border-green-500",
  cancelled: "bg-red-50 text-red-700 border-red-500",
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"profile" | "orders" | "password">("profile");
  const orders = user ? getUserOrders(user.id) : [];
  const [displayName, setDisplayName] = useState(() => user?.displayName || "");
  const [email, setEmail] = useState(() => user?.email || "");
  const [phone, setPhone] = useState(() => user?.phone || "");
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassConfirm, setNewPassConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth");
    }
  }, [user, loading, router]);

  if (!loading && !user) return null;

  const flash = (msg: string) => {
    setMessage(msg);
    setError("");
    setTimeout(() => setMessage(""), 3000);
  };

  const flashError = (msg: string) => {
    setError(msg);
    setMessage("");
  };

  const handleProfileSave = () => {
    if (!user) return;
    updateUser(user.id, { displayName: displayName.trim() || undefined, email: email.trim() || undefined, phone: phone.trim() || undefined });
    flash("Профиль обновлён");
  };

  const handlePasswordChange = () => {
    if (!user) return;
    if (newPass.length < 4) { flashError("Минимум 4 символа"); return; }
    if (newPass !== newPassConfirm) { flashError("Пароли не совпадают"); return; }
    const res = changePassword(user.id, oldPass, newPass);
    if (!res.success) { flashError(res.error || "Ошибка"); return; }
    setOldPass(""); setNewPass(""); setNewPassConfirm("");
    flash("Пароль изменён");
  };

  if (loading || !user) return null;

  const ROLE_LABEL: Record<string, string> = { user: "Пользователь", moderator: "Модератор", admin: "Администратор" };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-3xl font-black uppercase text-[#1A1A1A]">
            {user.displayName || user.login}
          </h1>
          <p className="font-mono text-xs text-gray-500">
            {ROLE_LABEL[user.role]} • С {new Date(user.createdAt).toLocaleDateString("ru-RU")}
          </p>
        </div>
        {(user.role === "admin" || user.role === "moderator") && (
          <Link
            href="/admin"
            className="border-2 border-black/80 bg-[#1A1A1A] px-4 py-2 font-mono text-xs font-bold uppercase text-white shadow-[3px_3px_0px_#FF4D00] transition-all hover:shadow-[1px_1px_0px_#FF4D00]"
          >
            Админ-панель
          </Link>
        )}
      </div>

      {message && (
        <div className="mb-4 border-2 border-black/80 bg-[#00E5FF] px-4 py-2 font-mono text-sm font-bold">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 border-2 border-red-500 bg-red-50 px-4 py-2 font-mono text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 flex gap-1">
        {(["profile", "orders", "password"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setError(""); setMessage(""); }}
            className={`border-2 px-4 py-2 font-mono text-xs font-bold uppercase transition-all ${
              tab === t
                ? "border-black/80 bg-[#FF4D00] text-white shadow-[2px_2px_0px_#1A1A1A]"
                : "border-black/40 bg-white text-[#1A1A1A] hover:border-black/80"
            }`}
          >
            {t === "profile" ? "Профиль" : t === "orders" ? `Заказы (${orders.length})` : "Пароль"}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === "profile" && (
        <div className="space-y-4 border-2 border-black/80 bg-white p-6 shadow-[4px_4px_0px_#F4F1EA]">
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              Имя / Никнейм
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder="Ваше имя"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              Телефон
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
              placeholder="+7 (999) 123-45-67"
            />
          </div>
          <button
            onClick={handleProfileSave}
            className="border-2 border-black/80 bg-[#FF4D00] px-6 py-2 font-mono text-sm font-bold uppercase text-white shadow-[3px_3px_0px_#1A1A1A] transition-all hover:shadow-[1px_1px_0px_#1A1A1A]"
          >
            Сохранить
          </button>
        </div>
      )}

      {/* Orders tab */}
      {tab === "orders" && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="border-2 border-black/80 bg-white p-8 text-center shadow-[4px_4px_0px_#F4F1EA]">
              <p className="font-mono text-sm text-gray-500">У вас пока нет заказов</p>
              <Link
                href="/catalog"
                className="mt-3 inline-block border-2 border-black/80 bg-[#FF4D00] px-4 py-2 font-mono text-xs font-bold uppercase text-white shadow-[3px_3px_0px_#1A1A1A]"
              >
                В каталог
              </Link>
            </div>
          ) : (
            orders
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order) => (
                <div key={order.id} className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-gray-500">
                      #{order.id.slice(-6).toUpperCase()} • {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                    </span>
                    <span className={`border-2 px-2 py-0.5 font-mono text-xs font-bold uppercase ${STATUS_COLORS[order.status]}`}>
                      {STATUS_LABELS[order.status]}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    {order.items.map((item) => (
                      <div key={item.product.id} className="flex justify-between font-mono text-sm">
                        <span>{item.product.name} × {item.quantity}</span>
                        <span className="font-bold">{(item.product.price * item.quantity).toLocaleString("ru-RU")} ₽</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 border-t border-gray-200 pt-2 text-right font-mono text-sm font-black">
                    Итого: {order.total.toLocaleString("ru-RU")} ₽
                  </div>
                </div>
              ))
          )}
        </div>
      )}

      {/* Password tab */}
      {tab === "password" && (
        <div className="space-y-4 border-2 border-black/80 bg-white p-6 shadow-[4px_4px_0px_#F4F1EA]">
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              Текущий пароль
            </label>
            <input
              type="password"
              value={oldPass}
              onChange={(e) => setOldPass(e.target.value)}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              Новый пароль
            </label>
            <input
              type="password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
              Подтвердите новый пароль
            </label>
            <input
              type="password"
              value={newPassConfirm}
              onChange={(e) => setNewPassConfirm(e.target.value)}
              className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            />
          </div>
          <button
            onClick={handlePasswordChange}
            className="border-2 border-black/80 bg-[#1A1A1A] px-6 py-2 font-mono text-sm font-bold uppercase text-white shadow-[3px_3px_0px_#FF4D00] transition-all hover:shadow-[1px_1px_0px_#FF4D00]"
          >
            Сменить пароль
          </button>
        </div>
      )}
    </div>
  );
}
