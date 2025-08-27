import SpotifyServer from "./spotify/spotifyServer.js";

const server = new SpotifyServer();
server.run().catch(console.error);
