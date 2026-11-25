"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

/** Renders `value` as a crisp SVG QR code that fills its container. */
export function QrCode({ value, className = "", dark = "#1d2b39" }: { value: string; className?: string; dark?: string }) {
  const [svg, setSvg] = useState("");
  useEffect(() => {
    if (!value) return;
    let live = true;
    QRCode.toString(value, { type: "svg", margin: 0, errorCorrectionLevel: "M", color: { dark, light: "#0000" } })
      .then((s) => live && setSvg(s))
      .catch(() => live && setSvg(""));
    return () => {
      live = false;
    };
  }, [value, dark]);
  return (
    <div
      className={`[&>svg]:block [&>svg]:h-full [&>svg]:w-full ${className}`}
      role="img"
      aria-label="QR code"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
