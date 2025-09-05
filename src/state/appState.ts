import { SpotifyAuth } from "../services/spotifyAuth.js";
import { SpotifyApiService } from "../services/spotifyApi.js";
import { TracksHandler } from "../services/handlers/tracks.js";
import MoodEngine from "../mood/moodEngine.js";

export default class AppState {
  private static instance: AppState;

  public spotifyApi: SpotifyApiService;
  public authSpotify: SpotifyAuth;
  public tracksHandler: TracksHandler;
  public moodEngine: MoodEngine;

  private constructor() {
    this.authSpotify = new SpotifyAuth();
    this.spotifyApi = new SpotifyApiService(this.authSpotify);
    this.tracksHandler = new TracksHandler(this.spotifyApi);
    this.moodEngine = new MoodEngine();
  }

  public static getInstance(): AppState {
    if (!AppState.instance) {
      AppState.instance = new AppState();
    }
    return AppState.instance;
  }
}
