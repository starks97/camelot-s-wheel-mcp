import type { MoodNode } from "./moodTypes.js";

export const moodGraph: Record<string, MoodNode> = {
  sad: {
    name: "sad",
    keywords: [
      "sad",
      "depressed",
      "lonely",
      "heartbroken",
      "grief",
      "miserable",
      "down",
      "hopeless",
      "tears",
      "pain",
    ],
    valence: { min: 0.1, max: 0.4 },
    energy: { min: 0.2, max: 0.5 },
    evolutionStep: { valence: 0.15, energy: 0.15 },
    edges: [
      {
        target: "anxious",
        conditions: {
          minValence: 0.3,
          minEnergy: 0.4,
        },
      },
      {
        target: "relaxed",
        conditions: {
          minValence: 0.5,
          maxEnergy: 0.6,
        },
      },
    ],
  },
  angry: {
    name: "angry",
    keywords: [
      "angry",
      "furious",
      "rage",
      "annoyed",
      "irritated",
      "mad",
      "outraged",
      "hate",
    ],
    valence: { min: 0.2, max: 0.5 },
    energy: { min: 0.6, max: 0.9 },
    evolutionStep: { valence: 0.1, energy: -0.15 },
    edges: [
      {
        target: "anxious",
        conditions: {
          maxValence: 0.5,
          minEnergy: 0.5,
        },
      },
      {
        target: "relaxed",
        conditions: {
          minValence: 0.4,
          maxEnergy: 0.7,
        },
      },
    ],
  },
  anxious: {
    name: "anxious",
    keywords: [
      "anxious",
      "nervous",
      "stressed",
      "worried",
      "panic",
      "overwhelmed",
      "fear",
    ],
    valence: { min: 0.3, max: 0.6 },
    energy: { min: 0.4, max: 0.7 },
    evolutionStep: { valence: 0.1, energy: -0.1 },
    edges: [
      {
        target: "relaxed",
        conditions: {
          minValence: 0.5,
        },
      },
    ],
  },
  relaxed: {
    name: "relaxed",
    keywords: [
      "calm",
      "peaceful",
      "relaxed",
      "serene",
      "chill",
      "tranquil",
      "zen",
    ],
    valence: { min: 0.5, max: 0.8 },
    energy: { min: 0.3, max: 0.6 },
    evolutionStep: { valence: 0.1, energy: 0.1 },
    edges: [
      {
        target: "happy",
        conditions: {
          minValence: 0.7,
        },
      },
    ],
  },
  happy: {
    name: "happy",
    keywords: [
      "happy",
      "joy",
      "excited",
      "awesome",
      "bliss",
      "thrilled",
      "ecstatic",
      "cheerful",
      "content",
      "celebrate",
    ],
    valence: { min: 0.7, max: 0.9 },
    energy: { min: 0.5, max: 0.9 },
    evolutionStep: { valence: -0.05, energy: 0 },
    edges: [],
  },
};
