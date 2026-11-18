// A soft wave divider (a nod to La Union's surf). `fill` is the color of the section below.
export function Wave({ fill, flip = false }: { fill: string; flip?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`block h-10 w-full md:h-16 ${flip ? "rotate-180" : ""}`}
    >
      <path
        fill={fill}
        d="M0,48 C180,80 360,16 540,32 C720,48 900,80 1080,56 C1260,32 1350,24 1440,40 L1440,80 L0,80 Z"
      />
    </svg>
  );
}
