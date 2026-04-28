import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative border-b-2 border-black/80 bg-[#1A1A1A] px-4 py-12 md:px-8 md:py-20 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute right-0 top-0 h-40 w-40 bg-[#FF4D00] opacity-20 md:h-64 md:w-64" />
      <div className="absolute bottom-0 left-10 h-24 w-24 bg-[#00E5FF] opacity-15 md:h-40 md:w-40" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <div className="mb-4 inline-block border-2 border-[#FF4D00] bg-[#FF4D00] px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-white shadow-[3px_3px_0px_#00E5FF]">
            🔥 Акция — скидка 20% по промокоду HAND2025
          </div>

          <h1 className="font-mono text-4xl font-black uppercase leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Вещи,{" "}
            <span className="text-[#FF4D00]">сделанные</span>{" "}
            руками
          </h1>

          <p className="mt-4 max-w-lg font-mono text-base text-gray-400 md:text-lg">
            Каждое изделие — уникально. Керамика, кожа, текстиль и дерево
            от мастеров со всей России.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/catalog"
              className="border-2 border-[#FF4D00] bg-[#FF4D00] px-6 py-3 font-mono text-sm font-bold uppercase text-white shadow-[4px_4px_0px_#1A1A1A] transition-all hover:shadow-[2px_2px_0px_#1A1A1A] hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              В каталог →
            </Link>
            <Link
              href="/catalog"
              className="border-2 border-white/30 bg-transparent px-6 py-3 font-mono text-sm font-bold uppercase text-white shadow-[4px_4px_0px_#00E5FF] transition-all hover:shadow-[2px_2px_0px_#00E5FF] hover:translate-x-[2px] hover:translate-y-[2px] hover:border-white"
            >
              Розыгрыш призов
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
