import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { Rsvp } from "@/components/Rsvp";
import { Stay } from "@/components/Stay";
import { firsts, laUnionFavorites, travelTips, weddingPages } from "@/content";

export function generateStaticParams() {
  return Object.keys(weddingPages).map((section) => ({ section }));
}

export default async function WeddingPage({ params }: PageProps<"/[section]">) {
  const { section } = await params;
  if (!Object.hasOwn(weddingPages, section)) notFound();

  const page = weddingPages[section as keyof typeof weddingPages];

  if (section === "rsvp") {
    return (
      <main className="pt-16" aria-label={page.title}>
        <Rsvp />
        <Faq />
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

        {section === "things-to-do" && (
          <ul className="mt-12 grid gap-4 sm:grid-cols-3">
            {laUnionFavorites.map((name) => (
              <li key={name} className="rounded-2xl border border-dusk-100 bg-white p-6 text-center font-serif text-3xl text-dusk-900">
                {name}
              </li>
            ))}
          </ul>
        )}

        {section === "travel" && (
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {travelTips.map(({ title, text, link }) => (
              <article key={title} className="rounded-2xl border border-dusk-100 bg-white p-6">
                <h2 className="font-serif text-3xl text-dusk-900">{title}</h2>
                <p className="mt-2 leading-relaxed text-dusk-700">{text}</p>
                <a href={link.href} className="mt-4 inline-block text-sm font-semibold text-dusk-700 underline underline-offset-4">
                  {link.label}
                </a>
              </article>
            ))}
          </div>
        )}
      </div>
      {section === "travel" && <Stay />}
    </main>
  );
}
