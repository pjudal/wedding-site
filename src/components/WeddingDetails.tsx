import Link from "next/link";
import heroPhoto from "@/assets/wedding-details-hero.webp";
import { weddingPages } from "@/content";
import { DressCode } from "./DressCode";
import { Schedule } from "./Schedule";
import { SectionPageHeader } from "./SectionPageHeader";

const sections = [
  { id: "weekend-timeline", label: "Weekend Timeline" },
  { id: "dress-code", label: "Dress Code" },
  { id: "little-favors", label: "A Few Little Favors" },
  { id: "wishes-and-blessings", label: "Wishes & Blessings" },
];

export function WeddingDetails() {
  return (
    <main className="bg-cream pt-16">
      <SectionPageHeader
        title={weddingPages["wedding-details"].title}
        image={heroPhoto}
        imageAlt="PJ and Jedah together under autumn trees with a bouquet of white roses"
        sections={sections}
      />
      <Schedule />
      <DressCode />
      <section id="little-favors" className="bg-cream px-5 py-14 text-center md:py-20">
        <h2 className="font-serif text-4xl text-dusk-900 md:text-5xl">A Few Little Favors</h2>
        <ul className="mx-auto mt-6 max-w-xl space-y-4 text-dusk-700">
          <li>During our unplugged ceremony, tuck your phones away and share the moment with us.</li>
          <li>We’re keeping the celebration intimate, so please join us with the guests named on your invitation.</li>
        </ul>
      </section>
      <section id="wishes-and-blessings" className="bg-butter-200 px-5 py-14 text-center md:py-20">
        <h2 className="font-serif text-4xl text-dusk-900 md:text-5xl">Wishes &amp; Blessings</h2>
        <p className="mx-auto mt-6 max-w-xl text-dusk-700">We’d love to hear from you. There’s a little space for a note in your RSVP.</p>
        <Link href="/rsvp" className="mt-4 inline-block font-semibold text-dusk-900 underline underline-offset-4">Leave us a note in your RSVP</Link>
      </section>
    </main>
  );
}
