"use client";

import { usePathname } from "next/navigation";

// Pages that stand on their own: no site menu or footer.
// Guest photo upload (QR target), guest gallery, projector slideshow, photo admin, printable QR cards.
const BARE = ["/share", "/gallery", "/live", "/photo-admin", "/photo-cards"];

/** Shows the site menu/footer everywhere except the standalone photo pages. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (BARE.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;
  return <>{children}</>;
}
