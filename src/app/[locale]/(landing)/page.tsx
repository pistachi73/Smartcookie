import { AboutUs } from "@/features/landing/components/about-us";
import { Features } from "@/features/landing/components/features";
import { Hero } from "@/features/landing/components/hero";
import { Highlights } from "@/features/landing/components/highlights";
import { Plans } from "@/features/landing/components/pricing-plans";

export default async function Home() {
  return (
    <main className="gap-3 overflow-hidden flex flex-col justify-center items-center gap-y-30 pb-30 bg-white">
      <div className="space-y-12">
        <Hero />
        <Features />
      </div>
      <Highlights />
      <Plans />
      <AboutUs />
    </main>
  );
}
