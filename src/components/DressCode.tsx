import Image from "next/image";
import ladiesLooks from "@/assets/attire-ladies-looks.webp";
import menLooks from "@/assets/attire-men-looks.webp";
import { GuestPalette } from "./GuestPalette";
import { attireToAvoid, dressCodeTagline, outfitIdeas, site } from "@/content";

const illustrations = {
  Ladies: { image: ladiesLooks, alt: "Guests in pastel and floral dresses chat with entourage friends in dusty blue and butter yellow" },
  Men: { image: menLooks, alt: "Guests in pastel button-downs and chinos mingle with entourage friends in dusty blue and butter yellow vests. Several men wear sunglasses." },
};

export function DressCode() {
  return (
    <section id="dress-code" aria-labelledby="dress-code-heading" className="relative isolate bg-butter-50 pb-16 md:pb-24">
      <div aria-hidden="true" className="scrapbook-edge pointer-events-none absolute inset-x-0 -top-px h-7 bg-dusk-500 sm:h-10" />
      <header className="bg-butter-50 px-4 py-14 text-center md:py-20">
        <h2 id="dress-code-heading" className="font-serif text-4xl text-dusk-900 md:text-5xl">
          Dress Code
        </h2>
        <p className="mx-auto mt-3 w-fit max-w-full rounded-full bg-dusk-300 px-5 py-2 font-serif text-2xl italic text-black">{dressCodeTagline}</p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-dusk-700 sm:text-base">{site.dressCode}</p>
      </header>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto grid w-full max-w-4xl gap-8 py-2 text-center sm:grid-cols-[1fr_2fr] sm:items-start">
          <div>
            <h3 className="mb-3 font-serif text-2xl italic text-dusk-700 underline decoration-dusk-300 decoration-wavy underline-offset-[5px]">Entourage</h3>
            <GuestPalette entourage />
          </div>
          <div>
            <h3 className="mb-3 font-serif text-2xl italic text-dusk-700 underline decoration-dusk-300 decoration-wavy underline-offset-[5px]">Guests</h3>
            <GuestPalette showGuestShades />
          </div>
        </div>

        <div className="mt-14 grid items-center gap-10 md:mt-20 lg:grid-cols-[minmax(0,1fr)_12rem] lg:gap-12">
          <div className="grid gap-10 md:gap-16">
            {outfitIdeas.map(({ title, description }, index) => (
              <article key={title} className="grid items-center gap-4 md:grid-cols-3 md:gap-8">
                <div className={index % 2 ? "md:col-start-3 md:row-start-1" : undefined}>
                  <h3 className="font-serif text-4xl italic text-dusk-700">{title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-dusk-700">{description}</p>
                </div>
                <div className={`mix-blend-multiply md:col-span-2 md:row-start-1 ${index % 2 ? "md:col-start-1" : "md:col-start-2"}`}>
                  <Image
                    src={illustrations[title].image}
                    alt={illustrations[title].alt}
                    sizes="(min-width: 1024px) 680px, (min-width: 768px) 62vw, 94vw"
                    className="h-auto w-full brightness-[1.09]"
                  />
                </div>
              </article>
            ))}
          </div>
          <aside aria-labelledby="attire-avoid" className="relative mx-auto w-full max-w-xs rotate-1 bg-cream px-6 pb-5 pt-6 shadow-sm lg:self-center">
            <span aria-hidden="true" className="scrapbook-tape -rotate-6">✦</span>
            <h3 id="attire-avoid" className="font-serif text-3xl italic text-dusk-900">Avoid</h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-dusk-700 md:grid-cols-1">
              {attireToAvoid.map((item) => (
                <li key={item} className="flex items-baseline gap-2 py-1"><span aria-hidden="true" className="text-dusk-500">×</span>{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
