import CartDrawer from "@/components/CartDrawer";

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
      <h1 className="mb-6 font-mono text-3xl font-black uppercase text-[#1A1A1A] md:text-4xl">
        Корзина
      </h1>
      <CartDrawer />
    </div>
  );
}
