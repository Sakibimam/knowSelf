import { TraitHome } from "@/components/TraitHome";
import type { InterpretationsData } from "@/lib/interpretations";
import bigFiveInterpretations from "@/quiz-data/trait-interpretations.v1.json";
import darkTriadInterpretations from "@/quiz-data/dark-triad-interpretations.v1.json";

export default function Home() {
  return (
    <TraitHome
      data={bigFiveInterpretations as InterpretationsData}
      darkTriadData={darkTriadInterpretations as InterpretationsData}
    />
  );
}
