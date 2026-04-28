"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/store";
import { useAuth } from "@/components/AuthProvider";

export default function Header() {
  const { user, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const items = getCart();
      setCartCount(items.reduce((s, i) => s + i.quantity, 0));
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("cart-update", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cart-update", update);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-black/80 bg-[#F4F1EA]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8">
        <Link
          href="/"
          className="font-mono text-2xl font-black tracking-tight text-[#1A1A1A] uppercase"
        >
          HANDMADE<span className="text-[#FF4D00]">.</span>SHOP
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 md:flex">
          <Link
            href="/"
            className="font-mono text-sm font-bold uppercase tracking-wide text-[#1A1A1A] transition-colors hover:text-[#FF4D00]"
          >
            Главная
          </Link>
          <Link
            href="/catalog"
            className="font-mono text-sm font-bold uppercase tracking-wide text-[#1A1A1A] transition-colors hover:text-[#FF4D00]"
          >
            Каталог
          </Link>
          <Link
            href="/designer"
            className="font-mono text-sm font-bold uppercase tracking-wide text-[#FF4D00] transition-colors hover:text-[#00E5FF]"
          >
            Конструктор
          </Link>
          {user && (user.role === "admin" || user.role === "moderator") && (
            <Link
              href="/admin"
              className="font-mono text-sm font-bold uppercase tracking-wide text-[#1A1A1A] transition-colors hover:text-[#FF4D00]"
            >
              Админка
            </Link>
          )}
          <Link
            href="/cart"
            className="relative border-2 border-black/80 bg-[#1A1A1A] px-4 py-2 font-mono text-sm font-bold uppercase text-white shadow-[4px_4px_0px_#FF4D00] transition-all hover:shadow-[2px_2px_0px_#FF4D00] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Корзина
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center bg-[#FF4D00] font-mono text-xs text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="border-2 border-black/80 bg-white px-3 py-2 font-mono text-xs font-bold uppercase transition-all hover:bg-[#F4F1EA]"
              >
                {user.displayName || user.login}
              </Link>
              <button
                onClick={logout}
                className="font-mono text-xs font-bold uppercase text-gray-500 transition-colors hover:text-[#FF4D00]"
              >
                Выйти
              </button>
            </div>
          ) : (
            <Link
              href="/auth"
              className="border-2 border-[#FF4D00] bg-white px-3 py-2 font-mono text-xs font-bold uppercase text-[#FF4D00] transition-all hover:bg-[#FF4D00] hover:text-white"
            >
              Войти
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          <span
            className={`block h-0.5 w-6 bg-black transition-transform ${menuOpen ? "translate-y-2 rotate-45" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-black transition-opacity ${menuOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-0.5 w-6 bg-black transition-transform ${menuOpen ? "-translate-y-2 -rotate-45" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="flex flex-col gap-2 border-t-2 border-black/80 bg-[#F4F1EA] px-4 pb-4 md:hidden">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="font-mono text-sm font-bold uppercase tracking-wide py-2"
          >
            Главная
          </Link>
          <Link
            href="/catalog"
            onClick={() => setMenuOpen(false)}
            className="font-mono text-sm font-bold uppercase tracking-wide py-2"
          >
            Каталог
          </Link>
          <Link
            href="/designer"
            onClick={() => setMenuOpen(false)}
            className="font-mono text-sm font-bold uppercase tracking-wide py-2 text-[#FF4D00]"
          >
            Конструктор
          </Link>
          {user && (user.role === "admin" || user.role === "moderator") && (
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="font-mono text-sm font-bold uppercase tracking-wide py-2"
            >
              Админка
            </Link>
          )}
          <Link
            href="/cart"
            onClick={() => setMenuOpen(false)}
            className="font-mono text-sm font-bold uppercase tracking-wide py-2"
          >
            Корзина {cartCount > 0 && `(${cartCount})`}
          </Link>
          {user ? (
            <>
              <Link
                href="/profile"
                onClick={() => setMenuOpen(false)}
                className="font-mono text-sm font-bold uppercase tracking-wide py-2 text-[#00E5FF]"
              >
                {user.displayName || user.login}
              </Link>
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="text-left font-mono text-sm font-bold uppercase tracking-wide py-2 text-gray-500"
              >
                Выйти
              </button>
            </>
          ) : (
            <Link
              href="/auth"
              onClick={() => setMenuOpen(false)}
              className="font-mono text-sm font-bold uppercase tracking-wide py-2 text-[#FF4D00]"
            >
              Войти / Регистрация
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
