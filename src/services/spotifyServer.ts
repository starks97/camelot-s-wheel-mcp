import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import AppState from "../state/appState.js";

import { TOOLS } from "../tools/definitions.js";

import ToolHandler from "../tools/handlers.js";

export default class SpotifyServer {
  private server: Server;
  private appState: AppState;
  private toolHandler: ToolHandler;

  constructor() {
    this.server = new Server(
      {
        name: `Camelot's Wheel Spotify Plugin`,
        version: "0.1.0",
        description:
          "A plugin to interact with Spotify API and provide music recommendations based on mood.",
      },
      {
        capabilities: {
          tools: {},
        },
      },
    );

    this.appState = AppState.getInstance();
    this.toolHandler = new ToolHandler(this.appState);
    this.setupToolHandler();

    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandler() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: Object.values(TOOLS),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case "get_access_token":
            return await this.toolHandler.handleGetAccessToken();
          case "get-track":
            return await this.toolHandler.handleGetTrack(
              request.params.arguments,
            );
          case "get-track-audio-features":
            return await this.toolHandler.handleGetTrackAudioFeatures(
              request.params.arguments,
            );
          case "get-recommendations":
            return await this.toolHandler.handleGetRecommendations(
              request.params.arguments,
            );
          case "detect-mood":
            return await this.toolHandler.handleDetectMood(
              request.params.arguments,
            );

          case "get-mood-transition":
            return await this.toolHandler.handleMoodTransition(
              request.params.arguments,
            );
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
          `Unexpected error in ${request.params.name}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    });
  }

  async run() {
    this.setupToolHandler();
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Spotify MCP server running on stdio");
  }

  async start() {
    this.setupToolHandler();
    console.log("Spotify MCP server started");
  }
}
