import Image from "next/image";
import ladiesLooks from "@/assets/attire-ladies-looks.webp";
import menLooks from "@/assets/attire-men-looks.webp";
import bulodPool from "@/assets/bulod-pool.webp";
import bulodSunset from "@/assets/timeline-day-1.webp";
import { GuestPalette } from "./GuestPalette";
import { attireToAvoid, detailHeadings, dressCodeTagline, outfitIdeas, site } from "@/content";

const illustrations = {
  Ladies: { image: ladiesLooks, alt: "Ten watercolor beach wedding looks with airy midi and maxi dresses in blush, peach, lilac, mint and sage, including floral prints" },
  Men: { image: menLooks, alt: "Ten watercolor beach wedding looks with pastel button-downs, tailored chinos and loafers. Several men wear sunglasses." },
};

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

      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_13rem]">
        <div className="grid gap-10">
          {outfitIdeas.map(({ title, description }) => (
            <article key={title} className="border-t border-dusk-200 pt-5">
              <h2 className="font-serif text-4xl italic text-dusk-700">{title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-dusk-700">{description}</p>
              <Image
                src={illustrations[title].image}
                alt={illustrations[title].alt}
                sizes="(min-width: 1060px) 780px, (min-width: 1024px) 76vw, 100vw"
                className="mt-4 h-auto w-full mix-blend-multiply"
              />
            </article>
          ))}
        </div>

        <aside aria-labelledby="attire-avoid" className="grid gap-8">
          <figure className="hidden lg:block">
            <Image
              src={bulodPool}
              alt="Bulod’s pool and guest rooms overlooking the sea"
              sizes="208px"
              className="aspect-[4/5] w-full rotate-3 border-8 border-white object-cover shadow-md"
            />
            <figcaption className="mt-3 text-center text-xs text-dusk-700">Photos by Bulod</figcaption>
          </figure>
          <div className="rounded-2xl border border-butter-200 bg-butter-50 p-6">
            <h2 id="attire-avoid" className="font-serif text-3xl italic text-dusk-900">Avoid</h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-dusk-700 md:grid-cols-1">
              {attireToAvoid.map((item) => (
                <li key={item} className="py-2">{item}</li>
              ))}
            </ul>
          </div>
          <Image
            src={bulodSunset}
            alt="Sunset over the sea reflected in Bulod’s pool"
            sizes="208px"
            className="hidden aspect-square w-full -rotate-3 border-8 border-white object-cover object-[center_75%] shadow-md lg:block"
          />
        </aside>
      </div>
    </section>
  );
}
