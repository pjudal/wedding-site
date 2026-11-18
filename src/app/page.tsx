import { Details } from "@/components/Details";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Nav } from "@/components/Nav";
import { Rsvp } from "@/components/Rsvp";
import { Stay } from "@/components/Stay";
import { Wave } from "@/components/Wave";
import { site } from "@/content";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Details />
        <Wave fill="var(--color-dusk-700)" />
        <Stay />
        <div className="bg-butter-50">
          <Wave fill="var(--color-dusk-700)" flip />
        </div>
        <Rsvp />
        <div className="bg-butter-50">
          <Wave fill="var(--color-cream)" />
        </div>
        <Faq />
      </main>
      <footer className="bg-dusk-900 px-4 py-14 text-center text-dusk-100">
        <p className="font-serif text-4xl text-cream">
          {site.coupleA} <span className="italic text-butter-400">&amp;</span> {site.coupleB}
        </p>
        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.35em]">
          {site.shortDate} · {site.venueArea}
        </p>
      </footer>
    </>
  );
}
