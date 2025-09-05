export const TOOLS = {
  GET_ACCESS_TOKEN: {
    name: "get_access_token",
    description: "Get a new access token from Spotify",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  GET_TRACK_AUDIO_FEATURE: {
    name: "get-track-audio-features",
    description: "Get audio features for a specific track.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Spotify track ID (e.g., 'spotify:track:<track_id>')",
        },
      },
      required: ["id"],
    },
  },
  GET_TRACK: {
    name: "get-track",
    description: "Get information about a specific track.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "Spotify track ID (e.g., 'spotify:track:<track_id>')",
        },
      },
      required: ["id"],
    },
  },
  GET_RECOMMENDATIONS: {
    name: "get-recommendations",
    description: "Get recommendations from your preferences using spotify API.",
    inputSchema: {
      type: "object",
      properties: {
        seed_tracks: {
          type: "array",
          items: { type: "string" },
          description:
            "A list of seed track IDs (e.g., ['spotify:track:<track_id1>', 'spotify:track:<track_id2>'])",
        },
        seed_artists: {
          type: "array",
          items: { type: "string" },
          description:
            "A list of seed artist IDs (e.g., ['spotify:artist:<artist_id1>', 'spotify:artist:<artist_id2>'])",
        },
        seed_genres: {
          type: "array",
          items: { type: "string" },
          description: "A list of seed genres (e.g., ['pop', 'rock'])",
        },
        limit: {
          type: "number",
          description:
            "The number of recommendations to retrieve (default is 20, max is 100)",
        },
        target_energy: {
          type: "number",
          description:
            "Target energy level for the recommended tracks (0.0 to 1.0)",
        },
        target_valence: {
          type: "number",
          description:
            "Target valence level for the recommended tracks (0.0 to 1.0)",
        },
      },
    },
  },
  DETECT_MOOD: {
    name: "detect-mood",
    description:
      "Detect the mood from a given text input using predefined moods.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Description of your mood (e.g., 'I'm sad')",
        },
      },
    },
  },
  GET_MOOD_TRANSITION: {
    name: "get-mood-transition",
    description: "Get the mood transition path based on the input text.",
    inputSchema: {
      type: "object",
      properties: {
        currentMood: {
          type: "string",
          description: "Current Mood State (e.g., 'I'm sad')",
        },
        max_steps: {
          type: "number",
          description:
            "Maximum number of steps for the mood transition (default is 1)",
        },
      },
    },
  },
} as const;
