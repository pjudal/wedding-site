"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { site } from "@/content";
import hero from "@/assets/hero.jpg";
import { Countdown } from "./Countdown";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  return (
    <section id="top" tabIndex={-1} ref={ref} className="relative h-[100svh] min-h-[600px] overflow-hidden bg-dusk-100">
      {/* Background photo: slow settle-in zoom + gentle parallax on scroll */}
      <motion.div
        style={{ y }}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.6, ease }}
        className="absolute inset-0"
      >
        <Image
          src={hero}
          alt={`${site.coupleA} and ${site.coupleB} at a canyon overlook`}
          fill
          preload
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[56%_70%]"
        />
      </motion.div>

      {/* Keeps the text readable on the bright sky; tints the bottom dusty blue */}
      <div className="absolute inset-0 bg-gradient-to-b from-cream/80 via-cream/10 to-dusk-900/50" />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 flex h-full flex-col items-center px-4 pt-24 text-center sm:pt-28"
      >
        <div className="wedding-banner relative w-full max-w-xl overflow-hidden rounded-full bg-butter-200 text-dusk-900">
          <p className="font-serif text-2xl font-semibold motion-safe:sr-only motion-reduce:py-1 motion-reduce:text-center">
            We’re getting married
          </p>
          <label className="absolute inset-y-0 right-0 z-10 flex items-center gap-1.5 border-l border-dusk-900/15 bg-butter-200 px-3 text-xs motion-reduce:hidden">
            <input type="checkbox" aria-label="Pause banner" className="accent-dusk-900" />
            Pause
          </label>
          <div aria-hidden="true" className="wedding-banner-track flex w-max motion-reduce:hidden">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="wedding-banner-phrase flex shrink-0 items-center gap-4 whitespace-nowrap px-3 py-3 font-serif text-lg font-semibold sm:text-xl">
                    We’re getting married <span className="text-dusk-700">♥</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5, ease }}
          className="mt-3 font-serif text-6xl font-medium leading-none text-dusk-950 sm:text-7xl md:text-8xl"
        >
          {site.coupleA} <span className="font-normal italic text-dusk-500">&amp;</span> {site.coupleB}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9, ease }}
          className="mt-5 font-serif text-xl italic text-dusk-900 sm:text-2xl"
        >
          {site.heroDateLabel}
          <span className="mx-2 not-italic text-butter-500">&#10022;</span>
          {site.venueArea}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2, ease }}
          className="mt-auto mb-24 sm:mb-28"
        >
          <Countdown />
        </motion.div>
      </motion.div>

      <a
        href="#details"
        aria-label="Scroll to details"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-cream"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="block h-8 w-px bg-cream/80"
        />
      </a>
    </section>
  );
}
