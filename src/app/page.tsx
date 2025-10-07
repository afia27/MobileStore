import CTAProductsButton from "@/components/CTAProductsButton";
import HeroCarousel from "@/components/HeroCarousel";

export default function Home() {
  return (
    <main>
      {/* Hero with side-by-side layout on desktop */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none" style={{backgroundImage:
          "radial-gradient(20rem 20rem at 20% 10%, #8b5cf6 20%, transparent 60%), radial-gradient(18rem 18rem at 80% 0%, #ec4899 10%, transparent 60%), radial-gradient(16rem 16rem at 50% 90%, #22d3ee 15%, transparent 60%)"}} />
        <div className="relative max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 md:grid-cols-12 items-center justify-items-center gap-24">
          <div className="text-center md:text-left md:col-span-4 md:pr-6">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-5 animate-fadeInUp">Find your next smartphone</h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 animate-fadeInUp animate-delay-150">Curated selection of Android and iOS devices at great prices.</p>
            <div className="animate-fadeInUp animate-delay-300 inline-block"><CTAProductsButton /></div>
          </div>
          <div className="animate-fadeInUp animate-delay-500 md:col-span-8 justify-self-center w-full md:pl-6">
            <HeroCarousel />
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-4 py-10 text-center text-sm text-gray-500">
        <p>Sign in and start shopping. Use the navbar for User/Admin access.</p>
      </section>
    </main>
  );
}
