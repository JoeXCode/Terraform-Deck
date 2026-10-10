import { Deck } from "@/components/Deck";
import { slides } from "@/data/slides";
import { sections } from "@/data/sections";

export default function Page() {
  return <Deck slides={slides} sections={sections} />;
}
