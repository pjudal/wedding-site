import { GuestPalette } from "./GuestPalette";
import { attireToAvoid, detailHeadings, dressCodeTagline, outfitIdeas, site } from "@/content";

export function DressCode() {
  return (
    <section aria-labelledby="dress-code">
      <header className="text-center">
        <h1 id="dress-code" className="scroll-mt-20 font-serif text-4xl italic leading-none text-dusk-900 sm:text-6xl">
          {detailHeadings.dressCode}
        </h1>
        <p className="mt-3 font-serif text-2xl italic text-dusk-700">{dressCodeTagline}</p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-dusk-700 sm:text-base">{site.dressCode}</p>
      </header>

      <div className="mx-auto mt-8 max-w-md">
        <GuestPalette />
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-[1fr_1fr_0.65fr]">
        {outfitIdeas.map(({ title, description, references }) => (
          <article key={title} className="rounded-2xl border border-dusk-100 bg-white p-6">
            <h2 className="font-serif text-3xl italic text-dusk-500">{title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-dusk-700">{description}</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2" aria-label={`Pinterest inspiration for ${title.toLowerCase()}`}>
              {references.map(({ label, href }) => (
                <li key={href}>
                  <a href={href} className="text-sm font-semibold text-dusk-700 underline decoration-dusk-300 underline-offset-4 hover:text-dusk-950">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}

        <aside aria-labelledby="attire-avoid" className="rounded-2xl border border-butter-200 bg-butter-50 p-6">
          <h2 id="attire-avoid" className="font-serif text-3xl italic text-dusk-900">Avoid</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-dusk-700 md:grid-cols-1">
            {attireToAvoid.map((item) => (
              <li key={item} className="py-2">{item}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
