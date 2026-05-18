import { TraitHome } from "@/components/TraitHome";
import type { InterpretationsData } from "@/lib/interpretations";
import interpretations from "../data/trait-interpretations.v1.json";

export default function Home() {
  return <TraitHome data={interpretations as InterpretationsData} />;
}
