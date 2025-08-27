import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { TrackArgs } from "../types/tracks.js";

import AppState from "../state/appState.js";

import { z } from "zod";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

export default class SpotifyServer {
  private validateArgs<T>(
    args: Record<string, unknown> | undefined,
    requiredFields: string[],
  ): T {
    if (!args) {
      throw new McpError(ErrorCode.InvalidParams, "Arguments are required");
    }

    for (const field of requiredFields) {
      if (!(field in args)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          `Missing required field: ${field}`,
        );
      }
    }

    return args as unknown as T;
  }

  private server: Server;
  private appState: AppState;

  constructor() {
    this.server = new Server(
      {
        name: "artistlens",
        version: "0.4.12",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.appState = AppState.getInstance();

    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandler() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "get_access_token",
          description: "Get Spotify access token.",
          inputSchema: {
            type: "object",
            properties: {},
            required: [],
          },
        },
        {
          name: "get-track-audio-features",
          description: "Get audio features for a specific track.",
          args: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description:
                  "Spotify track ID (e.g., 'spotify:track:<track_id>')",
              },
            },
            required: ["id"],
          },
        },
        {
          name: "get-track",
          description: "Get information about a specific track.",
          args: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description:
                  "Spotify track ID (e.g., 'spotify:track:<track_id>')",
              },
            },
            required: ["id"],
          },
        },
        {
          name: "get-recommendations",
          description:
            "Get recommendations from your preferences using spotify API.",
          args: {
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
        {
          name: "detect-mood",
          description:
            "Detect the mood from a given text input using predefined moods.",
          args: {
            type: "object",
            properties: {
              text: {
                type: "string",
                description: "Description of your mood (e.g., 'I'm sad')",
              },
            },
          },
        },
        {
          name: "get-mood-transition",
          description: "Get the mood transition path based on the input text.",
          args: {
            type: "object",
            properties: {
              text: {
                type: "string",
                description: "Description of your mood (e.g., 'I'm sad')",
              },
              max_steps: {
                type: "number",
                description:
                  "Maximum number of steps for the mood transition (default is 1)",
              },
            },
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case "get_access_token": {
            const token = await this.appState.authSpotify.getAccessToken();
            return {
              content: [
                {
                  type: "text",
                  text: `Access token: ${token}`,
                },
              ],
            };
          }
          case "get-track": {
            const args = this.validateArgs<TrackArgs>(
              request.params.arguments,
              ["id"],
            );
            const track = await this.appState.tracksHandler.getTrack(args);
            return {
              content: [
                {
                  type: "text",
                  text: `Track info: ${JSON.stringify(track, null, 2)}`,
                },
              ],
            };
          }
          case "get-track-audio-features": {
            const args = this.validateArgs<TrackArgs>(
              request.params.arguments,
              ["id"],
            );
            const audioFeatures =
              await this.appState.tracksHandler.getTrackAudioFeatures(args);
            return {
              content: [
                {
                  type: "text",
                  text: `Audio features: ${JSON.stringify(
                    audioFeatures,
                    null,
                    2,
                  )}`,
                },
              ],
            };
          }
          case "get-recommendations": {
            const RecommendationsArgsSchema = z.object({
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
                .optional()
                .describe(
                  "The number of recommendations to retrieve (default is 20, max is 100)",
                ),
              target_energy: z
                .number()
                .min(0)
                .max(1)
                .optional()
                .describe(
                  "Target energy level for the recommended tracks (0.0 to 1.0)",
                ),
              target_valence: z
                .number()
                .min(0)
                .max(1)
                .optional()
                .describe(
                  "Target valence level for the recommended tracks (0.0 to 1.0)",
                ),
            });

            const args = RecommendationsArgsSchema.parse(
              request.params.arguments,
            );

            const recommendations =
              await this.appState.tracksHandler.getRecommendations(args);
            return {
              content: [
                {
                  type: "text",
                  text: `Recommendations: ${JSON.stringify(
                    recommendations,
                    null,
                    2,
                  )}`,
                },
              ],
            };
          }
          case "detect-mood": {
            const DetectMoodArgsSchema = z.object({
              text: z
                .string()
                .describe("Description of your mood (e.g., 'I'm sad')"),
            });

            const args = DetectMoodArgsSchema.parse(request.params.arguments);

            const mood = this.appState.moodEngine.detectMood(args.text);
            return {
              content: [
                {
                  type: "text",
                  text: `Detected mood: ${JSON.stringify(mood, null, 2)}`,
                },
              ],
            };
          }
          case "get-mood-transition": {
            const MoodTransitionArgsSchema = z.object({
              text: z
                .string()
                .describe("Description of your mood (e.g., 'I'm sad')"),
              max_steps: z
                .number()
                .min(1)
                .optional()
                .describe(
                  "Maximum number of steps for the mood transition (default is 1)",
                ),
            });

            const args = MoodTransitionArgsSchema.parse(
              request.params.arguments,
            );

            const mood = this.appState.moodEngine.detectMood(args.text);
            const transition = this.appState.moodEngine.calculateMoodTransition(
              mood,
              args.max_steps || 1,
            );

            return {
              content: [
                {
                  type: "text",
                  text: `Mood transition: ${JSON.stringify(
                    transition,
                    null,
                    2,
                  )}`,
                },
              ],
            };
          }
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`,
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Unexpected error: ${error}`,
        );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Spotify MCP server running on stdio");
  }

  async start() {
    this.setupToolHandler();
    console.log("Spotify MCP server started");
  }
}
