import Link from "next/link";
import heroPhoto from "@/assets/travel-hero.webp";
import { travelTips, weddingPages } from "@/content";
import { LaUnionMap } from "./LaUnionMap";
import { SectionPageHeader } from "./SectionPageHeader";
import { SectionHeading } from "./SectionHeading";
import { Stay } from "./Stay";

const transportIcons = {
  car: "M6 25l5-2 5-9h15l6 9 5 2v9H6Zm5-2h26m-11-9v9M9 28h3m24 0h3M16 34a4 4 0 1 1-8 0m32 0a4 4 0 1 1-8 0",
  bus: "M6 29V17q0-5 5-5h25q6 0 6 6v16H6Zm0-10h35m-25 0v8m9-8v8m9-8v8M6 27h36m-3 3h3M17 34a4 4 0 1 1-8 0m22 0a4 4 0 1 1-8 0",
};

const travelSections = [
  { id: "getting-there", label: "Travel Guide", icon: "m5 13 12-5 14 5 12-5v28l-12 5-14-5-12 5zm12-5v28m14-23v28M9 30q9-10 18-5t11-7" },
  { id: "stay", label: "Accommodation", icon: "M6 37V14m0 17h36v6m-36-6V20h15q4 0 4 4v7m0-6h13q4 0 4 4v2m-31-6h9" },
  { id: "what-to-bring", label: "What to Bring", icon: "M9 19q0-3 3-3h24q3 0 3 3v20H9zm9-3v-5q0-3 3-3h6q3 0 3 3v5m-14 0v23m16-23v23" },
  { id: "while-youre-here", label: "While You’re Here", icon: "M24 42S10 27 10 18a14 14 0 0 1 28 0c0 9-14 24-14 24ZM29 18a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z" },
];

export function Travel() {
  return (
    <main className="bg-cream pt-16">
      <SectionPageHeader
        title={weddingPages.travel.title}
        image={heroPhoto}
        imageAlt="PJ and Jedah hold hands under autumn trees, with Jedah carrying a bouquet"
        sections={travelSections}
        intro={weddingPages.travel.intro}
      />

      <section id="getting-there" className="bg-butter-200">
        <div className="flow-root px-5 pt-14 md:pt-20">
          <SectionHeading eyebrow="Travel Guide" title="Getting There" eyebrowClassName="text-dusk-700" />
        </div>
        <div className="mx-auto grid max-w-5xl gap-4 px-5 pb-10 md:grid-cols-2 md:px-8 md:pb-14">
          {travelTips.map(({ mode, title, text, link }) => (
            <article key={title} className="rounded-2xl border border-dusk-100 bg-white p-6">
              <div className="flex items-center gap-3">
                <svg aria-hidden="true" viewBox="0 0 48 48" className="size-12 shrink-0 text-dusk-700" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="24" cy="24" r="21" className="fill-butter-50 stroke-none" />
                  <path d={transportIcons[mode]} />
                  <path d="M35 3v7m-3.5-3.5h7M10 6v5M7.5 8.5h5" />
                </svg>
                <h3 className="font-serif text-3xl leading-tight text-dusk-700">{title}</h3>
              </div>
              <p className="mt-2 leading-relaxed text-dusk-700">{text}</p>
              <a href={link.href} className="mt-4 inline-block text-sm font-semibold text-dusk-700 underline underline-offset-4">
                {link.label}
              </a>
            </article>
          ))}
        </div>
      </section>
      <Stay />
      <section id="what-to-bring" className="relative bg-cream px-5 py-14 md:px-8 md:py-20">
        <div aria-hidden="true" className="scrapbook-edge pointer-events-none absolute inset-x-0 -top-px h-7 bg-dusk-700 sm:h-10" />
        <h2 className="text-center font-serif text-4xl text-dusk-900 md:text-5xl">What to Bring</h2>
        <ul className="mx-auto mt-8 grid max-w-4xl gap-x-8 gap-y-5 rounded-2xl border border-dusk-100 bg-white p-6 text-dusk-700 sm:grid-cols-2 sm:p-8">
          <li>
            <strong className="text-dusk-900">Breathable outfits and comfortable footwear.</strong>{" "}
            Go for something breezy and shoes you’ll be happy dancing in. We’ve put a few ideas in the <Link href="/wedding-details#dress-code" className="font-semibold underline underline-offset-4">Dress Code</Link>.
          </li>
          <li>
            <strong className="text-dusk-900">Swimwear and casual wear.</strong>{" "}
            Bring something to swim in and a change of clothes if you’re staying the night before or after.
          </li>
          <li>
            <strong className="text-dusk-900">Sunscreen.</strong>{" "}
            We’ll be spending time in the sun. El Niño can make La Union’s <strong>hot, sunny, and dry weather</strong> feel even hotter.
          </li>
          <li>
            <strong className="text-dusk-900">Sunglasses.</strong>{" "}
            Bring your favorite pair for bright afternoons by the water.
          </li>
          <li>
            <strong className="text-dusk-900">Hair accessories.</strong>{" "}
            A clip or hair tie comes in handy when the sea breeze picks up.
          </li>
          <li>
            <strong className="text-dusk-900">Handheld fan.</strong>{" "}
            Toss one in if you like having a little breeze on warm afternoons.
          </li>
          <li>
            <strong className="text-dusk-900">Prescription medicine.</strong>{" "}
            Bring any prescription meds you take. We’ll have some common over-the-counter medicines on hand.
          </li>
          <li>
            <strong className="text-dusk-900">Water tumbler.</strong>{" "}
            Bring one if you like sipping on the go. Bulod will have drinking water and glasses.
          </li>
        </ul>
      </section>
      <section id="while-youre-here" className="relative bg-dusk-50 px-5 py-14 md:px-8 md:py-20">
        <div aria-hidden="true" className="scrapbook-edge pointer-events-none absolute inset-x-0 -top-px h-7 bg-cream sm:h-10" />
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-4xl text-dusk-900 md:text-5xl">While You’re Here</h2>
          <p className="mt-3 text-center text-dusk-700">A few of our favorite spots in La Union.</p>
          <LaUnionMap />
        </div>
      </section>
    </main>
  );
}
