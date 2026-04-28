"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, register } from "@/lib/auth";
import { useAuth } from "@/components/AuthProvider";

export default function AuthPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loginVal, setLoginVal] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.push("/profile");
    }
  }, [user, router]);

  if (user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!loginVal.trim() || !password.trim()) {
      setError("Заполните логин и пароль");
      return;
    }

    if (mode === "register") {
      if (password.length < 4) {
        setError("Пароль должен быть не менее 4 символов");
        return;
      }
      if (password !== passwordConfirm) {
        setError("Пароли не совпадают");
        return;
      }
      const result = register(loginVal.trim(), password, email.trim() || undefined);
      if (!result.success) {
        setError(result.error || "Ошибка регистрации");
        return;
      }
    } else {
      const result = login(loginVal.trim(), password);
      if (!result.success) {
        setError(result.error || "Ошибка входа");
        return;
      }
    }
    router.push("/profile");
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 md:px-8 md:py-16">
      <h1 className="font-mono text-3xl font-black uppercase text-[#1A1A1A]">
        {mode === "login" ? "Вход" : "Регистрация"}
      </h1>
      <p className="mt-1 font-mono text-sm text-gray-500">
        {mode === "login"
          ? "Войдите, чтобы видеть историю покупок и оставлять отзывы"
          : "Создайте аккаунт — это займёт пару секунд"}
      </p>

      {error && (
        <div className="mt-4 border-2 border-red-500 bg-red-50 px-4 py-2 font-mono text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
            Логин *
          </label>
          <input
            type="text"
            required
            value={loginVal}
            onChange={(e) => setLoginVal(e.target.value)}
            className="w-full border-2 border-black/80 bg-white px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            placeholder="mylogin"
            autoComplete="username"
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
            className="w-full border-2 border-black/80 bg-white px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
            placeholder="••••••"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
          />
        </div>

        {mode === "register" && (
          <>
            <div>
              <label className="mb-1 block font-mono text-xs font-bold uppercase text-gray-600">
                Подтвердите пароль *
              </label>
              <input
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full border-2 border-black/80 bg-white px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
                placeholder="••••••"
                autoComplete="new-password"
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
                className="w-full border-2 border-black/80 bg-white px-3 py-2 font-mono text-sm outline-none focus:shadow-[3px_3px_0px_#FF4D00]"
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="w-full border-2 border-black/80 bg-[#FF4D00] py-3 font-mono text-sm font-bold uppercase text-white shadow-[4px_4px_0px_#1A1A1A] transition-all hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          {mode === "login" ? "Войти" : "Зарегистрироваться"}
        </button>
      </form>

      {/* Social login stubs */}
      <div className="mt-6">
        <p className="mb-3 text-center font-mono text-xs text-gray-400 uppercase">
          или войти через
        </p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: "VK", bg: "#0077FF", color: "#fff" },
            { name: "Google", bg: "#fff", color: "#1A1A1A" },
            { name: "OK.ru", bg: "#EE8208", color: "#fff" },
            { name: "Яндекс", bg: "#FC3F1D", color: "#fff" },
          ].map((provider) => (
            <button
              key={provider.name}
              onClick={() => alert(`Авторизация через ${provider.name} требует настройки серверной части (OAuth). В демо-режиме используйте логин-пароль.`)}
              className="border-2 border-black/80 px-3 py-2 font-mono text-xs font-bold uppercase transition-all hover:shadow-[2px_2px_0px_#1A1A1A]"
              style={{ background: provider.bg, color: provider.color }}
            >
              {provider.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 text-center">
        {mode === "login" ? (
          <p className="font-mono text-sm text-gray-500">
            Нет аккаунта?{" "}
            <button
              onClick={() => { setMode("register"); setError(""); }}
              className="font-bold text-[#FF4D00] underline"
            >
              Зарегистрироваться
            </button>
          </p>
        ) : (
          <p className="font-mono text-sm text-gray-500">
            Уже есть аккаунт?{" "}
            <button
              onClick={() => { setMode("login"); setError(""); }}
              className="font-bold text-[#FF4D00] underline"
            >
              Войти
            </button>
          </p>
        )}
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/setup"
          className="font-mono text-xs text-gray-400 underline hover:text-[#FF4D00]"
        >
          Первичная настройка (для разработчиков)
        </Link>
      </div>
    </div>
  );
}
