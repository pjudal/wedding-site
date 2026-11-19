import { Details } from "@/components/Details";
import { Hero } from "@/components/Hero";
import { Welcome } from "@/components/Welcome";

export default function Home() {
  return (
    <main>
      <Welcome />
      <Hero />
      <Details />
    </main>
  );
}
