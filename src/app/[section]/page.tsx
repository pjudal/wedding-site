import { notFound, redirect } from "next/navigation";
import { Faq } from "@/components/Faq";
import { Rsvp } from "@/components/Rsvp";
import { WeddingDetails } from "@/components/WeddingDetails";
import { Travel } from "@/components/Travel";
import { firsts, weddingPages } from "@/content";

export function generateStaticParams() {
  return [...Object.keys(weddingPages), "things-to-do", "schedule", "dress-code"].map((section) => ({ section }));
}

export default async function WeddingPage({ params }: PageProps<"/[section]">) {
  const { section } = await params;
  if (section === "things-to-do") redirect("/travel#while-youre-here");
  if (section === "schedule") redirect("/wedding-details#weekend-timeline");
  if (section === "dress-code") redirect("/wedding-details#dress-code");
  if (!Object.hasOwn(weddingPages, section)) notFound();

  const page = weddingPages[section as keyof typeof weddingPages];

  if (section === "travel") return <Travel />;

  if (section === "wedding-details") return <WeddingDetails />;

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
      </div>
    </main>
  );
}
