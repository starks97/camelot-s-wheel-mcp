import { SpotifyApiService } from "../spotifyApi.js";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import type {
  AudioFeatures,
  RecommendationsArgs,
  RecommendationsResponse,
  SpotifyTrack,
  TrackArgs,
} from "../../types/tracks.js";

export class TracksHandler {
  constructor(private api: SpotifyApiService) {}

  private extractTrackId(id: string): string {
    return id.startsWith("spotify:track:") ? id.split(":")[2] : id;
  }

  async getTrack(args: TrackArgs) {
    const trackId = this.extractTrackId(args.id);
    return this.api.request<SpotifyTrack>("GET", `/tracks/${trackId}`);
  }

  async getTrackAudioFeatures(args: TrackArgs) {
    const trackId = this.extractTrackId(args.id);
    const audioFeaturesResult = await this.api.request<AudioFeatures>(
      "GET",
      `/audio-features/${trackId}`,
    );

    if (!audioFeaturesResult) {
      throw new McpError(
        ErrorCode.MethodNotFound,
        `Audio features for track ${trackId} not found`,
      );
    }

    return audioFeaturesResult;
  }

  async getRecommendations(args: RecommendationsArgs) {
    const {
      seed_tracks,
      seed_artists,
      seed_genres,
      limit,
      target_energy,
      target_valence,
    } = args;

    if (
      !seed_tracks &&
      !seed_artists &&
      !seed_genres &&
      !target_energy &&
      !target_valence
    ) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "At least one of seed_tracks, seed_artists, or seed_genres must be provided",
      );
    }

    if (!limit || limit < 1 || limit > 100) {
      throw new McpError(
        ErrorCode.InvalidParams,
        "Limit must be between 1 and 100",
      );
    }

    const tracksIds = seed_tracks?.map(this.extractTrackId);
    const artistsIds = seed_artists?.map((id) =>
      id.startsWith("spotify:artist:") ? id.split(":")[2] : id,
    );
    const genres = seed_genres?.map((genre) => genre.toLowerCase());

    const queryParams: Record<string, string> = {};
    if (limit) queryParams.limit = String(limit);
    if (seed_tracks)
      queryParams.seed_tracks = tracksIds?.length ? tracksIds.join(",") : "";
    if (seed_artists)
      queryParams.seed_artists = artistsIds?.length ? artistsIds.join(",") : "";
    if (seed_genres)
      queryParams.seed_genres = genres?.length ? genres.join(",") : "";
    if (target_energy !== undefined)
      queryParams.target_energy = String(target_energy);
    if (target_valence !== undefined)
      queryParams.target_valence = String(target_valence);

    const queryString = this.api.buildQueryString(queryParams);
    return this.api.request<RecommendationsResponse>(
      "GET",
      `/recommendations${queryString}`,
    );
  }
}
