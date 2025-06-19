import { Hero } from "@/features/landing/components/hero";
import { HeroCarrousel } from "@/features/landing/components/hero-carrouse";

export default async function Home() {
  return (
    <main className="flex gap-3 h-full bg-bg items-center flex-col">
      <Hero />
      <HeroCarrousel />
    </main>
  );
}
