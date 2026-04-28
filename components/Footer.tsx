import Link from "next/link";
import AdBanner from "@/components/AdBanner";

export default function Footer() {
  return (
    <>
      <div className="mx-auto max-w-7xl px-4 pb-4 md:px-8">
        <AdBanner placement="footer" />
      </div>
      <footer className="border-t-2 border-black/80 bg-[#1A1A1A] px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="font-mono text-lg font-black uppercase text-white">
                HANDMADE<span className="text-[#FF4D00]">.</span>SHOP
              </h3>
              <p className="mt-2 font-mono text-sm text-gray-400">
                Уникальные изделия ручной работы от лучших мастеров
              </p>
            </div>
            <div>
              <h4 className="font-mono text-sm font-bold uppercase text-[#00E5FF]">
                Навигация
              </h4>
              <ul className="mt-2 space-y-1 font-mono text-sm text-gray-400">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Главная
                  </Link>
                </li>
                <li>
                  <Link
                    href="/catalog"
                    className="hover:text-white transition-colors"
                  >
                    Каталог
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cart"
                    className="hover:text-white transition-colors"
                  >
                    Корзина
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-mono text-sm font-bold uppercase text-[#00E5FF]">
                Контакты
              </h4>
              <ul className="mt-2 space-y-1 font-mono text-sm text-gray-400">
                <li>hello@handmade.shop</li>
                <li>+7 (999) 123-45-67</li>
                <li>Москва, ул. Мастеров, 42</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-4 text-center font-mono text-xs text-gray-500">
            © 2025 HANDMADE.SHOP — Все права защищены
          </div>
        </div>
      </footer>
    </>
  );
}
