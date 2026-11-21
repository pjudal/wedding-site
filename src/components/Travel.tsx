import Link from "next/link";
import snowPhoto from "@/assets/timeline-day-3.webp";
import { travelTips, weddingPages } from "@/content";
import { LaUnionMap } from "./LaUnionMap";
import { SectionPageHeader } from "./SectionPageHeader";
import { SectionHeading } from "./SectionHeading";
import { Stay } from "./Stay";

const travelSections = [
  { id: "getting-there", label: "Travel Guide" },
  { id: "stay", label: "Accommodation" },
  { id: "what-to-bring", label: "What to Bring" },
  { id: "while-youre-here", label: "While You’re Here" },
];

export function Travel() {
  return (
    <main className="bg-cream pt-16">
      <SectionPageHeader
        title={weddingPages.travel.title}
        image={snowPhoto}
        imageAlt="PJ photographs Jedah as snow falls around them"
        sections={travelSections}
        intro={weddingPages.travel.intro}
      />

      <section id="getting-there" className="border-t border-dusk-100 bg-butter-200">
        <div className="flow-root px-5 pt-14 md:pt-20">
          <SectionHeading eyebrow="Travel Guide" title="Getting There" eyebrowClassName="text-dusk-700" />
        </div>
        <div className="mx-auto grid max-w-5xl gap-4 px-5 py-10 md:grid-cols-2 md:px-8 md:py-14">
          {travelTips.map(({ title, text, link }) => (
            <article key={title} className="rounded-2xl border border-dusk-100 bg-white p-6">
              <h3 className="font-serif text-3xl text-dusk-500">{title}</h3>
              <p className="mt-2 leading-relaxed text-dusk-700">{text}</p>
              <a href={link.href} className="mt-4 inline-block text-sm font-semibold text-dusk-700 underline underline-offset-4">
                {link.label}
              </a>
            </article>
          ))}
        </div>
      </section>
      <Stay />
      <section id="what-to-bring" className="border-t border-dusk-100 bg-cream px-5 py-14 md:px-8 md:py-20">
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
      <section id="while-youre-here" className="bg-dusk-50 px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-serif text-4xl text-dusk-900 md:text-5xl">While You’re Here</h2>
          <p className="mt-3 text-center text-dusk-700">A few of our favorite spots in La Union.</p>
          <LaUnionMap />
        </div>
      </section>
    </main>
  );
}
