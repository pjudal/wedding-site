import type { Metadata } from "next";
import { PrintCards } from "@/components/PrintCards";

export const metadata: Metadata = { title: "Table cards" };

export default function CardsPage() {
  return <PrintCards />;
}
