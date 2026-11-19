import Image from "next/image";
import illustratedCoast from "@/assets/la-union-illustrated-map.webp";
import alpas from "@/assets/la-union-alpas.webp";
import coffee from "@/assets/la-union-coffee.webp";
import gefseis from "@/assets/la-union-gefseis.webp";
import { laUnionFavorites, site } from "@/content";

const photos = {
  alpas: { image: alpas, alt: "Alpas Coffee and Plant Studio’s thatched café and garden seating" },
  coffee: { image: coffee, alt: "The Coffee Library’s two-storey wooden café in San Juan" },
  gefseis: { image: gefseis, alt: "Baklava served at Gefseis Greek Grill" },
};

export function LaUnionMap() {
  return (
    <figure className="mt-10">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(8rem,38%)] md:grid-cols-[minmax(0,1fr)_minmax(15rem,32%)]">
        <div className="relative isolate min-h-96 overflow-hidden rounded-2xl bg-dusk-100">
          <Image
            src={illustratedCoast}
            alt="Hand-painted map of the La Union coastline, with surf, palms, and coastal roads"
            fill
            sizes="(min-width: 1024px) 650px, 62vw"
            className="object-cover"
          />
          <svg aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" fill="none">
            {laUnionFavorites.map(({ id, pin }, index) => {
              const cardY = ((index + 0.5) / laUnionFavorites.length) * 100;
              return (
                <path
                  key={id}
                  d={`M ${pin.x} ${pin.y} C 76 ${pin.y}, 78 ${cardY}, 100 ${cardY}`}
                  className="stroke-dusk-700"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
          {laUnionFavorites.map(({ id, name, pin, mapsUrl }, index) => (
            <a
              key={id}
              href={mapsUrl}
              aria-label={`Map pin for ${name} on Google Maps`}
              style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              className="absolute grid size-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-cream bg-dusk-700 text-xs font-semibold text-cream shadow-sm hover:bg-dusk-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk-950 sm:size-10 sm:text-sm"
            >
              {index + 1}
            </a>
          ))}
          <a
            href={site.mapsUrl}
            aria-label="Bulod, you are here. Open in Google Maps"
            className="absolute bottom-[6%] left-[55%] flex -translate-x-1/2 flex-col items-center gap-1 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk-950"
          >
            <span aria-hidden="true" className="grid size-8 place-items-center rounded-full rounded-bl-none border-2 border-cream bg-butter-400 text-dusk-950 shadow-sm">
              ♥
            </span>
            <span className="whitespace-nowrap rounded-md bg-cream/95 px-2 py-1 text-center leading-tight text-dusk-950 shadow-sm">
              <span className="block font-serif text-lg font-semibold sm:text-2xl">{site.venueName}</span>
              <span className="block text-xs font-semibold">You are here</span>
            </span>
          </a>
        </div>
        <ul className="grid auto-rows-fr">
          {laUnionFavorites.map((place, index) => (
            <li key={place.id} className="relative flex items-center py-1.5 pl-3 before:absolute before:left-0 before:top-1/2 before:w-3 before:border-t-2 before:border-dashed before:border-dusk-700 sm:pl-5 sm:before:w-5">
              <article className="w-full overflow-hidden rounded-xl border border-dusk-100 bg-white shadow-sm">
                <a
                  href={place.mapsUrl}
                  className="block focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-dusk-700"
                  aria-label={`${place.name} on Google Maps`}
                >
                  <Image src={photos[place.id].image} alt={photos[place.id].alt} sizes="(min-width: 1024px) 300px, 36vw" className="aspect-[16/10] w-full object-cover" />
                  <h2 className="px-2 pt-2 font-serif text-lg leading-tight text-dusk-500 sm:px-3 sm:text-2xl">
                    <span className="sr-only">{index + 1}. </span>
                    <span className="box-decoration-clone bg-linear-to-t from-butter-200 from-30% to-transparent to-30% px-0.5">
                      {place.name}
                    </span>
                  </h2>
                  <span className="block px-2 pb-2 pt-1 text-xs text-dusk-700 underline underline-offset-2 sm:px-3">Google Maps</span>
                </a>
                <a href={place.photoCredit.href} className="block border-t border-dusk-100 px-2 py-1.5 text-[11px] text-dusk-700 sm:px-3">
                  Photo: {place.photoCredit.name}
                </a>
              </article>
            </li>
          ))}
        </ul>
      </div>
      <figcaption className="mt-3 text-xs text-dusk-700">Illustrated map, not to scale. Use the Google Maps links for directions.</figcaption>
    </figure>
  );
}
