import Image from "next/image";
import ladiesLooks from "@/assets/attire-ladies-looks.webp";
import menLooks from "@/assets/attire-men-looks.webp";
import { GuestPalette } from "./GuestPalette";
import { attireToAvoid, dressCodeTagline, outfitIdeas, site, weddingPages } from "@/content";

const illustrations = {
  Ladies: { image: ladiesLooks, alt: "Guests in pastel and floral dresses chat with entourage friends in dusty blue and butter yellow" },
  Men: { image: menLooks, alt: "Guests in pastel button-downs and chinos mingle with entourage friends in dusty blue and butter yellow vests. Several men wear sunglasses." },
};

export function DressCode() {
  return (
    <section aria-labelledby="dress-code" className="bg-dusk-500 pb-16 md:pb-24">
      <header className="bg-butter-200 px-4 pb-12 pt-28 text-center md:pb-14 md:pt-36">
        <h1 id="dress-code" className="scroll-mt-20 font-serif text-5xl text-dusk-900 md:text-7xl">
          {weddingPages["dress-code"].title}
        </h1>
        <p className="mx-auto mt-3 w-fit max-w-full rounded-full bg-dusk-300 px-5 py-2 font-serif text-2xl italic text-black">{dressCodeTagline}</p>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-dusk-700 sm:text-base">{site.dressCode}</p>
      </header>

      <div className="mx-auto max-w-5xl px-4 pt-8 md:pt-10">
        <div className="mx-auto grid max-w-2xl gap-6 rounded-2xl bg-cream px-4 py-6 text-center sm:grid-cols-[1fr_2fr] sm:px-6">
          <div>
            <h2 className="mb-3 font-serif text-2xl italic text-dusk-700">Entourage</h2>
            <GuestPalette entourage />
          </div>
          <div>
            <h2 className="mb-3 font-serif text-2xl italic text-dusk-700">Guests</h2>
            <GuestPalette showGuestShades />
          </div>
        </div>

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_13rem]">
          <div className="grid gap-10">
            {outfitIdeas.map(({ title, description }) => (
              <article key={title} className="isolate rounded-2xl bg-cream p-4 sm:p-6">
                <h2 className="font-serif text-4xl italic text-dusk-700">{title}</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-dusk-700">{description}</p>
                <Image
                  src={illustrations[title].image}
                  alt={illustrations[title].alt}
                  sizes="(min-width: 1024px) 704px, (min-width: 640px) calc(100vw - 5rem), calc(100vw - 4rem)"
                  className="mt-4 h-auto w-full mix-blend-multiply"
                />
              </article>
            ))}
          </div>

          <aside aria-labelledby="attire-avoid" className="rounded-2xl bg-butter-200 p-6">
            <h2 id="attire-avoid" className="font-serif text-3xl italic text-dusk-900">Avoid</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-dusk-700 md:grid-cols-1">
              {attireToAvoid.map((item) => (
                <li key={item} className="py-2">{item}</li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
