import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Providers } from "@/components/Providers";
import { site } from "@/content";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const title = `${site.coupleA} & ${site.coupleB} · ${site.weddingDateLabel.replace(/^\w+, /, "")}`;

export const metadata: Metadata = {
  title,
  description: `Join us in ${site.venueArea}. Kindly RSVP by ${site.rsvpDeadlineLabel}.`,
  // Private event: keep it out of search engines.
  robots: { index: false, follow: false },
  openGraph: { title, description: `${site.weddingDateLabel} · ${site.venueName}, ${site.venueArea}` },
};

export const viewport: Viewport = {
  themeColor: "#fcfaf4",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} antialiased`}>
      <body>
        <Providers>
          <Nav />
          {children}
          <footer className="bg-dusk-900 px-4 py-14 text-center text-dusk-100">
            <p className="font-serif text-4xl text-cream">
              {site.coupleA} <span className="italic text-butter-400">&amp;</span> {site.coupleB}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.35em]">
              {site.shortDate} · {site.venueArea}
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
