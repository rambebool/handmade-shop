"use client";

import { useSyncExternalStore, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { CartItem } from "@/lib/types";
import {
  getCart,
  updateQuantity,
  removeFromCart,
  cartTotal,
} from "@/lib/store";

function subscribe(cb: () => void) {
  window.addEventListener("cart-update", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("cart-update", cb);
    window.removeEventListener("storage", cb);
  };
}

function getSnapshot(): CartItem[] {
  return getCart();
}

function getServerSnapshot(): CartItem[] {
  return [];
}

export default function CartDrawer() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleQuantity = useCallback((id: string, qty: number) => {
    updateQuantity(id, qty);
    window.dispatchEvent(new Event("cart-update"));
  }, []);

  const handleRemove = useCallback((id: string) => {
    removeFromCart(id);
    window.dispatchEvent(new Event("cart-update"));
  }, []);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="border-2 border-black/80 bg-[#F4F1EA] p-8 text-center shadow-[6px_6px_0px_#FF4D00]">
          <p className="font-mono text-xl font-bold text-[#1A1A1A]">
            Корзина пуста
          </p>
          <p className="mt-2 font-mono text-sm text-gray-500">
            Добавьте товары из каталога
          </p>
          <Link
            href="/catalog"
            className="mt-4 inline-block border-2 border-black/80 bg-[#FF4D00] px-5 py-2 font-mono text-sm font-bold uppercase text-white shadow-[3px_3px_0px_#1A1A1A] transition-all hover:shadow-[1px_1px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            В каталог →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.product.id}
          className="flex gap-4 border-2 border-black/80 bg-white p-3 shadow-[4px_4px_0px_#F4F1EA]"
        >
          <div className="relative h-20 w-20 shrink-0 border-2 border-black/80 bg-[#F4F1EA]">
            <Image
              src={item.product.image}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <h3 className="font-mono text-sm font-bold text-[#1A1A1A]">
                {item.product.name}
              </h3>
              <p className="font-mono text-xs text-gray-500">
                {item.product.price.toLocaleString("ru-RU")} ₽ / шт
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-black/80">
                <button
                  onClick={() =>
                    handleQuantity(item.product.id, item.quantity - 1)
                  }
                  className="px-2 py-0.5 font-mono text-sm font-bold hover:bg-[#F4F1EA] transition-colors"
                >
                  −
                </button>
                <span className="border-x-2 border-black/80 px-3 py-0.5 font-mono text-sm font-bold">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    handleQuantity(item.product.id, item.quantity + 1)
                  }
                  className="px-2 py-0.5 font-mono text-sm font-bold hover:bg-[#F4F1EA] transition-colors"
                >
                  +
                </button>
              </div>
              <span className="font-mono text-sm font-black text-[#1A1A1A]">
                {(item.product.price * item.quantity).toLocaleString("ru-RU")} ₽
              </span>
              <button
                onClick={() => handleRemove(item.product.id)}
                className="ml-auto font-mono text-xs font-bold uppercase text-[#FF4D00] hover:underline"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      ))}

      <div className="border-2 border-black/80 bg-[#1A1A1A] p-4 shadow-[4px_4px_0px_#FF4D00]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-bold uppercase text-gray-400">
            Итого:
          </span>
          <span className="font-mono text-2xl font-black text-white">
            {cartTotal(items).toLocaleString("ru-RU")} ₽
          </span>
        </div>
        <button
          onClick={() => {
            alert(
              `Заказ оформлен! Сумма: ${cartTotal(items).toLocaleString("ru-RU")} ₽\n\nЭто заглушка — реальная оплата не подключена.`
            );
          }}
          className="mt-3 w-full border-2 border-[#FF4D00] bg-[#FF4D00] py-3 font-mono text-sm font-bold uppercase text-white shadow-[3px_3px_0px_#00E5FF] transition-all hover:shadow-[1px_1px_0px_#00E5FF] hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
}
