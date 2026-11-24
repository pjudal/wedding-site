import heroPhoto from "@/assets/wedding-details-hero.webp";
import { weddingPages } from "@/content";
import { DressCode } from "./DressCode";
import { Schedule } from "./Schedule";
import { SectionPageHeader } from "./SectionPageHeader";

const sections = [
  { id: "weekend-timeline", label: "Weekend Timeline", icon: "M9 12h30v28H9zM9 19h30M16 8v8m16-8v8m-16 9h3m5 0h3m5 0h2m-18 7h3m5 0h3m5 0h2" },
  { id: "dress-code", label: "Dress Code", icon: "M24 20v-3c0-3 5-3 5-7a5 5 0 0 0-10 0m5 10L6 32q-3 2 1 5h34q4-3 1-5Z" },
  { id: "little-favors", label: "A Few Little Favors", icon: "M10 23h28v17H10zm-2-7h32v7H8zm16 0v24m0-24c-5-1-13-2-12-7s9-3 12 7Zm0 0c5-1 13-2 12-7s-9-3-12 7Zm0 0-7 5m7-5 7 5" },
  { id: "wishes-and-blessings", label: "Wishes & Blessings", icon: "M7 15h34v23H7zm0 0 17 13 17-13M7 38l12-13m22 13L29 25M24 13c-2-2-7-5-7-8s5-4 7 0c2-4 7-3 7 0s-5 6-7 8Z" },
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
      <section id="little-favors" className="relative bg-dusk-100 px-5 pb-14 pt-16 text-center md:pb-20 md:pt-24">
        <div aria-hidden="true" className="scrapbook-edge pointer-events-none absolute inset-x-0 top-0 h-7 bg-butter-50 sm:h-10" />
        <h2 className="font-serif text-4xl text-dusk-900 md:text-5xl">A Few Little Favors</h2>
        <ul className="mx-auto mt-6 max-w-xl space-y-4 text-dusk-700">
          <li>During our unplugged ceremony, tuck your phones away and share the moment with us.</li>
          <li>We’re keeping the celebration intimate, so please join us with the guests named on your invitation.</li>
        </ul>
      </section>
      <section id="wishes-and-blessings" className="relative bg-butter-200 px-5 pb-14 pt-16 text-center md:pb-20 md:pt-24">
        <div aria-hidden="true" className="scrapbook-edge pointer-events-none absolute inset-x-0 top-0 h-7 bg-dusk-100 sm:h-10" />
        <h2 className="font-serif text-4xl text-dusk-900 md:text-5xl">Wishes &amp; Blessings</h2>
        <p className="mx-auto mt-6 max-w-xl text-dusk-700">
          Getting to spend the weekend with you is the best gift we could ask for. Thank you for making the time and the trip to celebrate with us.
        </p>
        <p className="mx-auto mt-6 max-w-xl text-dusk-700">Please feel free to come empty-handed. If you’d still like to give something, we’d be grateful for a little help building our honeymoon fund.</p>
      </section>
    </main>
  );
}
