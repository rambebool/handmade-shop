"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { hasAdminSetup, register } from "@/lib/auth";

export default function SetupPage() {
  const router = useRouter();
  const [loginVal, setLoginVal] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const adminExists = typeof window !== "undefined" && hasAdminSetup();

  if (adminExists && !done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center md:px-8">
        <h1 className="font-mono text-2xl font-black uppercase text-[#1A1A1A]">
          Настройка завершена
        </h1>
        <p className="mt-2 font-mono text-sm text-gray-500">
          Суперадмин уже создан. Войдите через{" "}
          <a href="/auth" className="text-[#FF4D00] underline">страницу входа</a>.
        </p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginVal.trim() || !password.trim()) {
      setError("Заполните логин и пароль");
      return;
    }
    if (password.length < 4) {
      setError("Пароль должен быть не менее 4 символов");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Пароли не совпадают");
      return;
    }

    const result = register(loginVal.trim(), password, email.trim() || undefined, "admin");
    if (!result.success) {
      setError(result.error || "Ошибка регистрации");
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/admin"), 2000);
  };

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center md:px-8">
        <div className="border-2 border-black/80 bg-[#00E5FF] p-6 font-mono shadow-[4px_4px_0px_#1A1A1A]">
          <h2 className="text-xl font-black uppercase">Суперадмин создан!</h2>
          <p className="mt-2 text-sm">Перенаправляем в админ-панель...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 md:px-8 md:py-16">
      <div className="mb-6 border-l-4 border-[#FF4D00] pl-4">
        <h1 className="font-mono text-2xl font-black uppercase text-[#1A1A1A]">
          Первичная настройка
        </h1>
        <p className="mt-1 font-mono text-sm text-gray-500">
          Создайте аккаунт суперадминистратора. Эта страница доступна только один раз — пока в системе нет ни одного админа.
        </p>
      </div>

      {error && (
        <div className="mb-4 border-2 border-red-500 bg-red-50 px-4 py-2 font-mono text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 border-2 border-black/80 bg-white p-6 shadow-[6px_6px_0px_#F4F1EA]">
        <div>
          <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
            Логин администратора *
          </label>
          <input
            type="text"
            required
            value={loginVal}
            onChange={(e) => setLoginVal(e.target.value)}
            className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            placeholder="admin"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
            Пароль *
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            placeholder="••••••"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
            Подтвердите пароль *
          </label>
          <input
            type="password"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            placeholder="••••••"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
            Email (необязательно)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-black/80 bg-[#F4F1EA] px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            placeholder="admin@handmade.shop"
          />
        </div>
        <button
          type="submit"
          className="w-full border-2 border-black/80 bg-[#FF4D00] py-3 font-mono text-sm font-bold uppercase text-white shadow-[4px_4px_0px_#1A1A1A] transition-all hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          Создать суперадмина
        </button>
      </form>
    </div>
  );
}
