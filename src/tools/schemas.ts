import { z } from "zod";

export const TrackArgsSchema = z.object({
  id: z
    .string()
    .describe("Spotify track ID (e.g., 'spotify:track:<track_id>')"),
});

export const DetectMoodArgsSchema = z.object({
  text: z.string().describe("Text to analyze for mood detection"),
});
export const MoodTransitionArgsSchema = z.object({
  current_mood: z
    .string()
    .describe("Current mood (e.g., 'happy', 'sad', 'energetic')"),
  max_steps: z
    .number()
    .min(1)
    .optional()
    .describe("Maximum number of steps for the mood transition (default is 1)"),
});

export const RecommendationsArgsSchema = z.object({
  seed_tracks: z
    .array(z.string())
    .optional()
    .describe(
      "A list of seed track IDs (e.g., ['spotify:track:<track_id1>', 'spotify:track:<track_id2>'])",
    ),
  seed_artists: z
    .array(z.string())
    .optional()
    .describe(
      "A list of seed artist IDs (e.g., ['spotify:artist:<artist_id1>', 'spotify:artist:<artist_id2>'])",
    ),
  seed_genres: z
    .array(z.string())
    .optional()
    .describe("A list of seed genres (e.g., ['pop', 'rock'])"),
  limit: z
    .number()
    .min(1)
    .max(100)
    .default(20)
    .describe("The number of recommendations to return (1-100)"),
  target_energy: z
    .number()
    .min(0.0)
    .max(1.0)
    .optional()
    .describe("Target energy level for the recommended tracks (0.0 to 1.0)"),
  target_valence: z
    .number()
    .min(0.0)
    .max(1.0)
    .optional()
    .describe(
      "Target valence (musical positiveness) for the recommended tracks (0.0 to 1.0)",
    ),
});
