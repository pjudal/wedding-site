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
      <main className="min-h-[70svh] px-4 pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="mx-auto max-w-5xl">
          <DressCode />
        </div>
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
          <section id="getting-there" className="border-t border-dusk-100">
            <div className="bg-dusk-700 px-5 pt-14 md:pt-20">
              <div className="flow-root">
                <SectionHeading eyebrow="Travel Guide" title="Getting There" light />
              </div>
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
        </>
      )}
    </main>
  );
}
