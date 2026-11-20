import Link from "next/link";
import { notFound } from "next/navigation";
import { DressCode } from "@/components/DressCode";
import { Faq } from "@/components/Faq";
import { Rsvp } from "@/components/Rsvp";
import { SectionHeading } from "@/components/SectionHeading";
import { LaUnionMap } from "@/components/LaUnionMap";
import { Stay } from "@/components/Stay";
import { firsts, travelTips, weddingPages } from "@/content";

export function generateStaticParams() {
  return Object.keys(weddingPages).map((section) => ({ section }));
}

export default async function WeddingPage({ params }: PageProps<"/[section]">) {
  const { section } = await params;
  if (!Object.hasOwn(weddingPages, section)) notFound();

  const page = weddingPages[section as keyof typeof weddingPages];

  if (section === "dress-code") {
    return (
      <main className="min-h-[70svh]">
        <DressCode />
      </main>
    );
  }

  if (section === "faq") {
    return (
      <main className="min-h-[70svh] pt-16">
        <Faq title={page.title} />
      </main>
    );
  }

  if (section === "rsvp") {
    return (
      <main className="pt-16" aria-label={page.title}>
        <Rsvp />
      </main>
    );
  }

  return (
    <main className="min-h-[70svh] bg-cream pt-16">
      <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-24">
        <header className="text-center">
          <h1 className="font-serif text-5xl text-dusk-900 md:text-7xl">{page.title}</h1>
          {"intro" in page && <p className="mt-4 text-dusk-700">{page.intro}</p>}
        </header>

        {section === "our-story" && (
          <ol className="mx-auto mt-12 max-w-2xl space-y-8 border-l border-dusk-200 pl-6">
            {firsts.map(({ title, story }) => (
              <li key={title}>
                <h2 className="font-serif text-3xl text-dusk-900">{title}</h2>
                <p className="mt-2 text-dusk-700">{story ?? "Story coming soon."}</p>
              </li>
            ))}
          </ol>
        )}

        {section === "things-to-do" && <LaUnionMap />}
      </div>
      {section === "travel" && (
        <>
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
                Check out the <Link href="/dress-code" className="font-semibold underline underline-offset-4">Dress Code</Link> for outfit ideas.
              </li>
              <li>
                <strong className="text-dusk-900">Swimwear and casual wear.</strong>{" "}
                Pack extra outfits if you’re staying overnight before or after the wedding.
              </li>
              <li>
                <strong className="text-dusk-900">Sunscreen.</strong>{" "}
                Pack sun protection for <strong>hot, sunny, and dry conditions</strong>, which El Niño can intensify in La Union.
              </li>
              <li><strong className="text-dusk-900">Sunglasses.</strong></li>
              <li><strong className="text-dusk-900">Hair accessories.</strong></li>
              <li><strong className="text-dusk-900">Handheld fan,</strong> if you’d like one.</li>
              <li>
                <strong className="text-dusk-900">Prescription medicine.</strong>{" "}
                Bring any medication you take regularly. Common over-the-counter medicines will be available at the event.
              </li>
              <li>
                <strong className="text-dusk-900">Water tumbler.</strong>{" "}
                Bring one if you’d like. Drinking water and glasses will be available at Bulod.
              </li>
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
