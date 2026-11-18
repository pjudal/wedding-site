"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/content";

const links = [
  { href: "#details", label: "The Day" },
  { href: "#stay", label: "Stay" },
  { href: "#faq", label: "FAQ" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled || open ? "bg-cream/85 shadow-[0_1px_0_rgba(38,56,74,0.08)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <a href="#top" className="font-serif text-2xl font-medium tracking-wide text-dusk-900">
          {site.coupleA[0]}
          <span className="mx-1 italic text-dusk-500">&amp;</span>
          {site.coupleB[0]}
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium tracking-wide text-dusk-700 transition-colors hover:text-dusk-950"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#rsvp"
            className="rounded-full bg-butter-400 px-5 py-2 text-sm font-semibold text-dusk-950 shadow-sm transition hover:bg-butter-500"
          >
            RSVP
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <a href="#rsvp" className="rounded-full bg-butter-400 px-4 py-1.5 text-sm font-semibold text-dusk-950">
            RSVP
          </a>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full text-dusk-900"
          >
            <span className="relative block h-3 w-5">
              <span
                className={`absolute left-0 h-0.5 w-5 bg-current transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-0.5 w-5 bg-current transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="flex flex-col px-4 pb-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-dusk-100 py-3 font-serif text-2xl text-dusk-900"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
