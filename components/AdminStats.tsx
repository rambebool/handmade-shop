"use client";

import { useState } from "react";
import { getOrders, getAdminProducts, getReviews, getQuestions, getAds } from "@/lib/store";
import { getUsers } from "@/lib/auth";
import mockProductsRaw from "@/lib/mock-products.json";

function computeStats() {
  const users = getUsers();
  const orders = getOrders();
  const adminProducts = getAdminProducts();
  const reviews = getReviews();
  const questions = getQuestions();
  const ads = getAds();

  const ordersByStatus: Record<string, number> = {};
  let revenue = 0;
  for (const o of orders) {
    ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    if (o.status !== "cancelled") revenue += o.total;
  }

  return {
    totalUsers: users.length,
    totalOrders: orders.length,
    totalRevenue: revenue,
    totalProducts: mockProductsRaw.length + adminProducts.length,
    totalReviews: reviews.length,
    totalQuestions: questions.length,
    totalAds: ads.length,
    ordersByStatus,
    recentOrders: orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10),
  };
}

export default function AdminStats() {
  const [stats] = useState(() => computeStats());

  const STATUS_LABELS: Record<string, string> = {
    pending: "Ожидает",
    processing: "В обработке",
    shipped: "Отправлен",
    delivered: "Доставлен",
    cancelled: "Отменён",
  };

  const cards = [
    { label: "Пользователи", value: stats.totalUsers, color: "#FF4D00" },
    { label: "Заказы", value: stats.totalOrders, color: "#00E5FF" },
    { label: "Выручка", value: `${stats.totalRevenue.toLocaleString("ru-RU")} ₽`, color: "#16A34A" },
    { label: "Товары", value: stats.totalProducts, color: "#2563EB" },
    { label: "Отзывы", value: stats.totalReviews, color: "#EC4899" },
    { label: "Вопросы", value: stats.totalQuestions, color: "#EAB308" },
    { label: "Рекламные блоки", value: stats.totalAds, color: "#7C3AED" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
            <p className="font-mono text-xs font-bold uppercase text-gray-500">{card.label}</p>
            <p className="mt-1 font-mono text-2xl font-black" style={{ color: card.color }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Orders by status */}
      {stats.totalOrders > 0 && (
        <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
          <h2 className="mb-3 font-mono text-lg font-black uppercase">Заказы по статусу</h2>
          <div className="flex flex-wrap gap-3">
            {Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="border-2 border-gray-300 px-3 py-2">
                <span className="font-mono text-xs text-gray-500">{STATUS_LABELS[status] || status}</span>
                <span className="ml-2 font-mono text-sm font-black">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      {stats.recentOrders.length > 0 && (
        <div className="border-2 border-black/80 bg-white p-4 shadow-[4px_4px_0px_#F4F1EA]">
          <h2 className="mb-3 font-mono text-lg font-black uppercase">Последние заказы</h2>
          <div className="space-y-2">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex flex-wrap items-center justify-between gap-2 border-2 border-gray-200 p-2">
                <span className="font-mono text-xs font-bold text-gray-500">
                  #{order.id.slice(-6).toUpperCase()}
                </span>
                <span className="font-mono text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("ru-RU")}
                </span>
                <span className="font-mono text-xs font-bold">
                  {order.total.toLocaleString("ru-RU")} ₽
                </span>
                <span className="font-mono text-xs uppercase text-gray-500">
                  {STATUS_LABELS[order.status]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {stats.totalOrders === 0 && (
        <div className="border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="font-mono text-sm text-gray-400">
            Пока нет данных для статистики. Как только появятся заказы и пользователи, здесь будут отображаться метрики.
          </p>
        </div>
      )}
    </div>
  );
}
