"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site, weddingTabs } from "@/content";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [heroTitlePassed, setHeroTitlePassed] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const compactBrand = pathname === "/" && !heroTitlePassed;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const heroTitle = pathname === "/" ? document.getElementById("wedding-hero-title") : null;
    const updateHeader = () => {
      setScrolled(window.scrollY > 40);
      setHeroTitlePassed(Boolean(heroTitle && navRef.current &&
        heroTitle.getBoundingClientRect().bottom <= navRef.current.getBoundingClientRect().bottom));
    };
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
    window.addEventListener("resize", updateHeader);
    return () => {
      window.removeEventListener("scroll", updateHeader);
      window.removeEventListener("resize", updateHeader);
    };
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        pathname !== "/" || scrolled || open ? "bg-cream/85 shadow-[0_1px_0_rgba(38,56,74,0.08)] backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav ref={navRef} className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" aria-label="Wedding home" onClick={() => setOpen(false)} className="whitespace-nowrap font-serif text-2xl font-medium tracking-wide text-dusk-900">
          {compactBrand ? site.coupleA[0] : site.coupleA}
          <span className="mx-1 italic text-dusk-500">{compactBrand ? "&" : " & "}</span>
          {compactBrand ? site.coupleB[0] : site.coupleB}
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {weddingTabs.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
              className={l.href === "/rsvp"
                ? "rounded-full bg-butter-400 px-5 py-2 text-sm font-semibold text-dusk-950 shadow-sm transition hover:bg-butter-500"
                : "text-sm font-medium text-dusk-700 transition-colors hover:text-dusk-950 aria-[current=page]:underline aria-[current=page]:underline-offset-4"}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <Link href="/rsvp" onClick={() => setOpen(false)} className="rounded-full bg-butter-400 px-4 py-1.5 text-sm font-semibold text-dusk-950">
            RSVP
          </Link>
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
            className="overflow-hidden lg:hidden"
          >
            <div className="flex flex-col px-4 pb-4">
              {weddingTabs.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="border-b border-dusk-100 py-3 font-serif text-2xl text-dusk-900 aria-[current=page]:font-semibold"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
