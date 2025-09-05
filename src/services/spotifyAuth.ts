import "dotenv/config";
import axios from "axios";
import { McpError, ErrorCode } from "@modelcontextprotocol/sdk/types.js";
import type { TokenInfo } from "../types/common.js";

const SPOTIFY_API_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
  throw new Error(
    "SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET environment variables are required",
  );
}

export class SpotifyAuth {
  private tokenInfo: TokenInfo | null = null;

  async getAccessToken(): Promise<string> {
    if (this.tokenInfo && Date.now() < this.tokenInfo.expiresAt) {
      return this.tokenInfo.accessToken;
    }

    try {
      const response = await axios.post(
        SPOTIFY_API_URL,
        new URLSearchParams({
          grant_type: "client_credentials",
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              Buffer.from(
                SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET,
              ).toString("base64"),
          },
        },
      );

      this.tokenInfo = {
        accessToken: response.data.access_token,
        expiresAt: Date.now() + response.data.expires_in * 1000,
      };

      return this.tokenInfo.accessToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to get Spotify access token: ${error.response?.data?.error ?? error.message}`,
        );
      }
      throw error;
    }
  }
}
