import { moodGraph } from "./moodGraph.js";
import type { MoodTransitionResult, MoodNode } from "./moodTypes.js";
import { clamp } from "../utils/clamp.js";

export default class MoodEngine {
  private moodgraph = moodGraph;

  detectMood(text: string): keyof typeof moodGraph {
    const normalizedText = text.toLowerCase().split(/\s+/);
    for (const [mood, settings] of Object.entries(this.moodgraph)) {
      if (
        settings.keywords.some((word: string) => normalizedText.includes(word))
      ) {
        return mood;
      }
    }
    return "neutral";
  }

  private _calculateNextMoodState(
    currentState: MoodNode,
    currentValence: number,
    currentEnergy: number,
  ) {
    // Primero calculamos los nuevos valores sin clamp para verificar las condiciones
    let potentialValence = currentValence + currentState.evolutionStep.valence;
    let potentialEnergy = currentEnergy + currentState.evolutionStep.energy;

    const validTransitions = currentState.edges.filter((edge) => {
      const targetNode = moodGraph[edge.target];
      const conditions = edge.conditions;

      // Verificamos las condiciones con los valores potenciales (sin clamp)
      const valenceOk =
        (conditions.minValence === undefined ||
          potentialValence >= conditions.minValence) &&
        (conditions.maxValence === undefined ||
          potentialValence <= conditions.maxValence);

      const energyOK =
        (conditions.minEnergy === undefined ||
          potentialEnergy >= conditions.minEnergy) &&
        (conditions.maxEnergy === undefined ||
          potentialEnergy <= conditions.maxEnergy);

      // Verificamos que los valores potenciales (con clamp) estén dentro del rango del objetivo
      const clampedValence = clamp(
        potentialValence,
        targetNode.valence.min,
        targetNode.valence.max,
      );
      const clampedEnergy = clamp(
        potentialEnergy,
        targetNode.energy.min,
        targetNode.energy.max,
      );

      const inTargetRange =
        clampedValence >= targetNode.valence.min &&
        clampedValence <= targetNode.valence.max &&
        clampedEnergy >= targetNode.energy.min &&
        clampedEnergy <= targetNode.energy.max;

      return valenceOk && energyOK && inTargetRange;
    });

    return validTransitions.length > 0 ? validTransitions[0].target : null;
  }

  calculateMoodTransition(
    currentMood: string,
    maxSteps: number = 1,
  ): MoodTransitionResult | null {
    const path = [currentMood];
    let current = currentMood;

    const initialNode = moodGraph[current];

    if (!initialNode) throw new Error("there is not a mood in the graph");

    let currentValence =
      (initialNode.valence.min + initialNode.valence.max) / 2;
    let currentEnergy = (initialNode.energy.min + initialNode.energy.max) / 2;

    currentValence = clamp(
      currentValence,
      initialNode.valence.min,
      initialNode.valence.max,
    );
    currentEnergy = clamp(
      currentEnergy,
      initialNode.energy.min,
      initialNode.energy.max,
    );

    for (let i = 0; i < maxSteps; i++) {
      const currentNode = moodGraph[current];
      const nextMood = this._calculateNextMoodState(
        currentNode,
        currentValence,
        currentEnergy,
      );

      if (!nextMood) break;

      // Actualizamos los valores ANTES de cambiar de estado
      currentValence += currentNode.evolutionStep.valence;
      currentEnergy += currentNode.evolutionStep.energy;

      // Aseguramos que los nuevos valores estén dentro del rango del NUEVO estado
      const targetNode = moodGraph[nextMood];
      currentValence = clamp(
        currentValence,
        targetNode.valence.min,
        targetNode.valence.max,
      );
      currentEnergy = clamp(
        currentEnergy,
        targetNode.energy.min,
        targetNode.energy.max,
      );

      path.push(nextMood);
      current = nextMood;
    }

    return {
      path,
      currentMood: current,
      valence: parseFloat(currentValence.toFixed(2)),
      energy: parseFloat(currentEnergy.toFixed(2)),
      isFinalMood: moodGraph[currentMood].edges.length === 0,
      nextMood: moodGraph[currentMood].edges.map((e) => e.target),
    };
  }
}
