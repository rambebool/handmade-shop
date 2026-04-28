import HeroBanner from "@/components/HeroBanner";
import BentoGridHome from "./BentoGridHome";
import AdBanner from "@/components/AdBanner";
import PageBlocks from "@/components/PageBlocks";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <div className="mx-auto max-w-7xl px-4 pt-4 md:px-8">
        <AdBanner placement="home-banner" />
      </div>
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
        <PageBlocks pageId="home-top" />
      </div>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8 md:py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-mono text-2xl font-black uppercase text-[#1A1A1A] md:text-3xl">
              Популярное
            </h2>
            <p className="mt-1 font-mono text-sm text-gray-500">
              Лучшие товары наших мастеров
            </p>
          </div>
          <a
            href="/catalog"
            className="hidden border-2 border-black/80 bg-white px-4 py-2 font-mono text-xs font-bold uppercase shadow-[3px_3px_0px_#FF4D00] transition-all hover:shadow-[1px_1px_0px_#FF4D00] hover:translate-x-[2px] hover:translate-y-[2px] md:block"
          >
            Все товары →
          </a>
        </div>
        <BentoGridHome />
      </section>
      <div className="mx-auto max-w-7xl px-4 pb-8 md:px-8">
        <PageBlocks pageId="home-bottom" />
      </div>
    </>
  );
}
