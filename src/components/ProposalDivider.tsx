export function ProposalDivider() {
  return (
    <svg
      viewBox="0 0 640 140"
      role="img"
      aria-label="Jedah gives PJ two donuts. Eleven dots lead to PJ kneeling to propose to Jedah."
      className="mx-auto mt-12 block h-auto w-full max-w-3xl text-cream sm:mt-16"
    >
      <defs>
        <filter id="proposal-chalk" x="-5%" y="-10%" width="110%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency=".38" numOctaves="3" seed="21" result="grain" />
          <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter="url(#proposal-chalk)" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        {/* Jedah offers two donuts to PJ. */}
        <path d="M36 45c-11 0-17-12-13-22 5-13 26-13 31 0 4 11-5 23-18 22Z M22 35q-2 12-8 18 M29 15q5 12 22 11 M37 46l-1 11-14 33 32 1-18-34 M29 91l-7 28-8 2 M46 92l9 27 8 1 M36 57l17 12 22-7 M32 59l-13 15" />
        <path d="M142 45c-11 0-18-10-16-21 3-14 24-16 31-4 6 11-2 24-15 25Z M127 22l8-7 6 4 7-3 M141 46l-1 42m0 0-14 31-9 1m23-32 15 31 8 1 M140 54l-17 17-19-9 M141 56l17 18" />
        <path d="M38 33q4 4 8 0m87 0q4 4 8 1" strokeWidth="2" />
        <g className="proposal-donuts" stroke="var(--color-butter-200)">
          <circle cx="83" cy="56" r="7" />
          <circle cx="99" cy="54" r="7" />
        </g>

        {/* PJ kneels with a ring in front of Jedah. */}
        <path d="M499 66c-11 1-19-7-19-17 0-12 14-20 25-14 12 6 10 26-6 31Z M482 44l8-7 7 3 8-1 M498 67l-7 33m0 0 25-13 12 29m-37-16-13 17-15 1m65-2 9 1 M496 72l17 8 22-19 M492 74l11 14 29-22" />
        <path d="M594 46c-12 0-19-10-17-21 3-12 19-16 29-7 11 10 3 28-12 28Z M588 16q8 13 21 13m-29 7q-1 12-8 17 M595 47l2 12-15 33 32-1-17-32 M589 92l-7 28-8 1m33-29 8 28 8 1 M596 60l-17 7-16-17m35 10 7-9" />
        <path d="M501 55q4 3 7-1m75-20q3 4 7 1" strokeWidth="2" />
        <path className="proposal-ring" d="M534 60h12v7h-12Zm6-2c-5-1-4-7 0-7s5 6 0 7Zm-3-8 3-3 3 3" stroke="var(--color-butter-200)" strokeWidth="2.4" />
      </g>
      <g className="proposal-dots" fill="currentColor">
        {Array.from({ length: 11 }, (_, index) => (
          <circle key={index} cx={191 + index * 25.5} cy={73 + Math.sin(index * 0.67) * 5} r="2.7" />
        ))}
      </g>
    </svg>
  );
}
