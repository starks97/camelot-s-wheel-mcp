export interface TrackArgs {
  id: string;
}

export interface RecommendationsArgs {
  seed_tracks?: string[];
  seed_artists?: string[];
  seed_genres?: string[];
  limit?: number;
}

export interface GenreSeedsResponse {
  genres: string[];
}

export interface SpotifyTrack {
  album: {
    album_type: "album" | "single" | "compilation";
    total_tracks: number;
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: {
      url: string;
      height: number;
      width: number;
    }[];
    name: string;
    release_date: string;
    release_date_precision: "year" | "month" | "day";
    restrictions?: {
      reason: string;
    };
    type: "album";
    uri: string;
    artists: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: "artist";
      uri: string;
    }[];
  };
  artists: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    name: string;
    type: "artist";
    uri: string;
  }[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  is_playable: boolean;
  linked_from?: Record<string, unknown>;
  restrictions?: {
    reason: string;
  };
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

export interface AudioFeatures {
  acousticness: number;
  analysis_url: string;
  danceability: number;
  duration_ms: number;
  energy: number;
  id: string;
  instrumentalness: number;
  key: number;
  liveness: number;
  loudness: number;
  mode: number;
  speechiness: number;
  tempo: number;
  time_signature: number;
  track_href: string;
  type: "audio_features";
  uri: string;
  valence: number;
}

export interface RecommendationsArgs {
  limit?: number;
  market?: string;
  seed_artists?: string[];
  seed_genres?: string[];
  seed_tracks?: string[];
  target_energy?: number;
  target_valence?: number;
}

interface ExternalUrlObject {
  spotify: string;
}

interface ImageObject {
  url: string;
  height: number;
  width: number;
}

interface RestrictionsObject {
  reason: string;
}

interface ArtistObject {
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface AlbumObject {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: RestrictionsObject;
  type: string;
  uri: string;
  artists: ArtistObject[];
}

interface ExternalIdObject {
  isrc: string;
  ean?: string;
  upc?: string;
}

interface LinkedTrackObject {
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  type: string;
  uri: string;
}

interface TrackObject {
  album: AlbumObject;
  artists: ArtistObject[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIdObject;
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  is_playable?: boolean;
  linked_from?: LinkedTrackObject;
  restrictions?: RestrictionsObject;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
  is_local: boolean;
}

interface RecommendationSeedObject {
  afterFilteringSize: number;
  afterRelinkingSize: number;
  href: string;
  id: string;
  initialPoolSize: number;
  type: string;
}

export interface RecommendationsResponse {
  seeds: RecommendationSeedObject[];
  tracks: TrackObject[];
}
