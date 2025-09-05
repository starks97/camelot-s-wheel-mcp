import axios from "axios";
import { SpotifyAuth } from "./spotifyAuth.js";
import ErrorHandler from "../exceptions/errorHandler.js";

const SPOTIFY_API_BASE_URL = "https://api.spotify.com/v1";

export class SpotifyApiService {
  private auth: SpotifyAuth;
  public static handleError = ErrorHandler.handleGeneralError;

  constructor(auth: SpotifyAuth) {
    this.auth = auth;
  }

  async request<T>(
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    endpoint: string,
    data?: T,
  ): Promise<T> {
    const accessToken = await this.auth.getAccessToken();
    try {
      const response = await axios({
        method,
        url: `${SPOTIFY_API_BASE_URL}${endpoint}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        data,
      });
      return response.data;
    } catch (error) {
      throw SpotifyApiService.handleError(error);
    }
  }

  buildQueryString(
    params: Record<string, string | number | boolean | undefined>,
  ) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        query.set(key, String(value));
      }
    }
    return query.toString() ? `?${query.toString()}` : "";
  }
}
