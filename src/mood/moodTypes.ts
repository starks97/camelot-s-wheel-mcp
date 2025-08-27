export type MoodTransitionResult = {
  path: string[];
  currentMood: string;
  valence: number;
  energy: number;
  isFinalMood: boolean;
  nextMood: string[] | null;
};

export interface MoodNode {
  name: string;
  valence: { min: number; max: number };
  keywords: string[];
  energy: { min: number; max: number };
  evolutionStep: {
    valence: number;
    energy: number;
  };
  edges: MoodEdge[];
}

export interface MoodEdge {
  target: string;
  conditions: {
    minValence?: number;
    maxValence?: number;
    minEnergy?: number;
    maxEnergy?: number;
  };
}
