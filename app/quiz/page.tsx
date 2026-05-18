import { PersonalityQuiz } from "@/components/PersonalityQuiz";
import type { InterpretationsData } from "@/lib/interpretations";
import type { QuizPack } from "@/lib/quiz-types";
import interpretations from "@/quiz-data/trait-interpretations.v1.json";
import quizPack from "@/quiz-data/quiz-items.v1.json";

export default function QuizPage() {
  return (
    <PersonalityQuiz
      pack={quizPack as QuizPack}
      interpretations={interpretations as InterpretationsData}
    />
  );
}
