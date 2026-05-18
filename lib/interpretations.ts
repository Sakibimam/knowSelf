export type TraitLevel = "low" | "typical" | "high";

export type TraitBand = {
  summary: string;
  strengths: string[];
  blindSpots: string[];
  contextCaveat: string;
};

export type TraitInterpretation = {
  name: string;
  low: TraitBand;
  typical: TraitBand;
  high: TraitBand;
};

export type InterpretationsData = {
  globalDisclaimer: string;
  confidenceNote: string;
  traits: Record<string, TraitInterpretation>;
};
