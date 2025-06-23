import { Features } from "@/features/landing/components/features";
import { Hero } from "@/features/landing/components/hero";
import { MainPoints } from "@/features/landing/components/main-points";
import { Plans } from "@/features/landing/components/pricing/pricing-plans";

export default async function Home() {
  return (
    <main className="gap-3 overflow-hidden flex flex-col justify-center items-center gap-y-30">
      <div className="space-y-12">
        <Hero />
        {/* <HeroCarrousel /> */}
        <Features />
      </div>
      <MainPoints />
      <Plans />
    </main>
  );
}
