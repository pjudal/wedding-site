import { faqs } from "@/content";
import { Reveal } from "./Reveal";

export function Faq({ title }: { title: string }) {
  return (
    <section id="faq" className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-10 text-center font-serif text-5xl text-dusk-900 md:mb-14 md:text-7xl">
          {title}
        </h1>
        <Reveal>
          <div className="divide-y divide-dusk-100 rounded-3xl bg-white/70 px-6 ring-1 ring-dusk-100 md:px-8">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-serif text-xl md:text-2xl [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-butter-200 text-dusk-900 transition-transform duration-300 group-open:rotate-45"
                  >
                    <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <path d="M6 1v10M1 6h10" strokeLinecap="round" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-3 pr-10 leading-relaxed text-dusk-700">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
