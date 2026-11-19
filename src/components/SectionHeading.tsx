import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  light = false,
  eyebrowClassName = light ? "text-butter-200" : "text-dusk-500",
}: {
  eyebrow: string;
  title: string;
  light?: boolean;
  eyebrowClassName?: string;
}) {
  return (
    <Reveal className="mb-10 text-center md:mb-14">
      <p
        className={`text-xs font-semibold uppercase tracking-[0.3em] ${eyebrowClassName}`}
      >
        {eyebrow}
      </p>
      <h2
        className={`mt-3 font-serif text-4xl font-medium md:text-6xl ${light ? "text-cream" : "text-dusk-900"}`}
      >
        {title}
      </h2>
    </Reveal>
  );
}
