import Image, { type StaticImageData } from "next/image";

export function SectionPageHeader({ title, image, imageAlt, sections, intro }: {
  title: string;
  image: StaticImageData;
  imageAlt: string;
  sections: ReadonlyArray<{ id: string; label: string; icon: string }>;
  intro?: string;
}) {
  return (
    <header className="text-center">
      <div className="grid bg-dusk-950">
        <Image
          src={image}
          alt={imageAlt}
          preload
          sizes="100vw"
          className="col-start-1 row-start-1 block h-auto w-full self-center"
        />
        <div className="relative col-start-1 row-start-1 flex min-w-0 flex-col justify-end bg-linear-to-t from-dusk-950/95 via-dusk-950/40 to-transparent px-2 pb-3 pt-4 text-white sm:px-8 sm:pb-10 lg:pb-16">
          <h1 className="font-serif text-4xl font-semibold leading-none sm:text-6xl lg:text-8xl">{title}</h1>
          <nav aria-label="On this page" className="mx-auto mt-3 grid w-full max-w-2xl grid-cols-4 gap-1 sm:mt-6 sm:gap-4">
            {sections.map(({ id, label, icon }) => (
              <a
                key={id}
                href={`#${id}`}
                className="group flex min-w-0 flex-col items-center gap-1 rounded-md px-1 py-1 text-xs font-semibold leading-tight underline-offset-4 transition-colors hover:text-butter-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:text-sm"
              >
                <svg aria-hidden="true" viewBox="0 0 48 48" className="size-7 text-butter-200 motion-safe:transition-transform motion-safe:group-hover:-translate-y-1 sm:size-11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icon} />
                </svg>
                <span>{label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
      {intro && <p className="mx-auto max-w-2xl px-5 py-6 text-dusk-700">{intro}</p>}
    </header>
  );
}
