import AppState from "../state/appState.js";
import {
  TrackArgsSchema,
  DetectMoodArgsSchema,
  RecommendationsArgsSchema,
  MoodTransitionArgsSchema,
} from "./schemas.js";

import ErrorHandler from "../exceptions/errorHandler.js";

export default class ToolHandler {
  private appState: AppState;
  public static handleError = ErrorHandler.handleGeneralError;
  constructor(appState: AppState) {
    this.appState = appState;
  }

  async handleGetAccessToken() {
    try {
      const token = await this.appState.authSpotify.getAccessToken();
      if (!token) {
        throw new Error("Failed to get access token");
      }
      return {
        content: [
          {
            type: "text",
            text: `Access token: ${token}`,
          },
        ],
      };
    } catch (error) {
      throw ToolHandler.handleError(error);
    }
  }

  async handleGetTrack(args: any) {
    try {
      const parsedArgs = TrackArgsSchema.parse(args);
      const track = await this.appState.tracksHandler.getTrack(parsedArgs);
      return {
        content: [
          {
            type: "text",
            text: `Track info: ${JSON.stringify(track, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw ToolHandler.handleError(error);
    }
  }

  async handleGetTrackAudioFeatures(args: any) {
    try {
      const parsedArgs = TrackArgsSchema.parse(args);
      const features =
        await this.appState.tracksHandler.getTrackAudioFeatures(parsedArgs);
      return {
        content: [
          {
            type: "text",
            text: `Audio features: ${JSON.stringify(features, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw ToolHandler.handleError(error);
    }
  }

  async handleGetRecommendations(args: any) {
    try {
      const parsedArgs = RecommendationsArgsSchema.parse(args);
      const recommendations =
        await this.appState.tracksHandler.getRecommendations(parsedArgs);
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
    } catch (error) {
      throw ToolHandler.handleError(error);
    }
  }

  async handleDetectMood(args: any) {
    try {
      const parsedArgs = DetectMoodArgsSchema.parse(args);
      const mood = this.appState.moodEngine.detectMood(parsedArgs.text);
      return {
        content: [
          {
            type: "text",
            text: `Detected mood: ${mood}`,
          },
        ],
      };
    } catch (error) {
      throw ToolHandler.handleError(error);
    }
  }

  async handleMoodTransition(args: any) {
    try {
      const parsedArgs = MoodTransitionArgsSchema.parse(args);
      const transition = this.appState.moodEngine.calculateMoodTransition(
        parsedArgs.current_mood,
        parsedArgs.max_steps || 1,
      );
      return {
        content: [
          {
            type: "text",
            text: `Mood transition: ${JSON.stringify(transition, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw ToolHandler.handleError(error);
    }
  }
}
