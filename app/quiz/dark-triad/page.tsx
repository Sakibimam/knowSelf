import { PersonalityQuiz } from "@/components/PersonalityQuiz";
import type { InterpretationsData } from "@/lib/interpretations";
import type { QuizPack } from "@/lib/quiz-types";
import interpretations from "@/quiz-data/dark-triad-interpretations.v1.json";
import quizPack from "@/quiz-data/dark-triad-items.v1.json";

export default function DarkTriadQuizPage() {
  return (
    <PersonalityQuiz
      pack={quizPack as QuizPack}
      interpretations={interpretations as InterpretationsData}
      variant="dark-triad"
    />
  );
}
