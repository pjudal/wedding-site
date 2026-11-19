import { attireToAvoid, detailHeadings, dressCodeTagline, outfitIdeas, site } from "@/content";

export function DressCode() {
  return (
    <section aria-labelledby="dress-code" className="rounded-3xl bg-cream p-5 ring-1 ring-dusk-100 sm:p-8 md:p-12">
      <div className="border-y border-dusk-200 py-7 text-center">
        <h1 id="dress-code" className="scroll-mt-20 font-serif text-4xl italic leading-none text-dusk-900 sm:text-6xl">
          {detailHeadings.dressCode}
        </h1>
        <p className="mt-3 font-serif text-2xl italic text-dusk-700">{dressCodeTagline}</p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-dusk-700 sm:text-base">{site.dressCode}</p>
      </div>

      <ul className="mx-auto my-7 grid max-w-md grid-cols-5 gap-1 sm:gap-4" aria-label="Guest color palette">
        {site.guestPalette.map(({ name, hex }) => (
          <li key={name} className="flex min-w-0 flex-col items-center gap-2 text-center text-xs leading-tight text-dusk-700">
            <span
              aria-hidden="true"
              className="block size-8 rounded-full shadow-inner ring-1 ring-dusk-900/10 sm:size-12"
              style={{ background: hex }}
            />
            {name}
          </li>
        ))}
      </ul>

      <div className="grid gap-6 border-t border-dusk-200 pt-7 md:grid-cols-[2fr_1fr] md:items-start">
        <div className="divide-y divide-dusk-200">
          {outfitIdeas.map(({ title, description, references }) => (
            <div key={title} className="pb-6 pt-6 first:pt-0 last:pb-0">
              <h2 className="font-serif text-4xl italic text-dusk-900">{title}</h2>
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
            </div>
          ))}
        </div>

        <aside aria-labelledby="attire-avoid" className="rounded-2xl bg-butter-50 p-5 md:p-6">
          <h2 id="attire-avoid" className="font-serif text-3xl italic text-dusk-900">Avoid</h2>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-dusk-700 md:grid-cols-1">
            {attireToAvoid.map((item) => (
              <li key={item} className="border-t border-dusk-200 py-2">{item}</li>
            ))}
          </ul>
        </aside>
      </div>
    </section>
  );
}
