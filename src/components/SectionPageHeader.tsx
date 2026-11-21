import Image, { type StaticImageData } from "next/image";

export function SectionPageHeader({ title, image, imageAlt, sections, intro }: {
  title: string;
  image: StaticImageData;
  imageAlt: string;
  sections: ReadonlyArray<{ id: string; label: string }>;
  intro?: string;
}) {
  return (
    <header className="text-center">
      <div className="relative h-[clamp(15rem,42vw,35rem)] overflow-hidden bg-dusk-100">
        <Image
          src={image}
          alt={imageAlt}
          fill
          preload
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">
        <h1 className="font-serif text-5xl text-dusk-900 md:text-7xl">{title}</h1>
        <nav aria-label="On this page" className="mt-6 flex flex-wrap justify-center gap-3">
          {sections.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="rounded-full border border-dusk-300 px-4 py-2 text-sm font-semibold text-dusk-700 transition-colors hover:border-butter-400 hover:bg-butter-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk-700"
            >
              {label}
            </a>
          ))}
        </nav>
        {intro && <p className="mx-auto mt-5 max-w-2xl text-dusk-700">{intro}</p>}
      </div>
    </header>
  );
}
