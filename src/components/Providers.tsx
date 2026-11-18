"use client";

import { MotionConfig } from "motion/react";

// reducedMotion="user" turns animations off for guests who've asked their device for less motion.
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
