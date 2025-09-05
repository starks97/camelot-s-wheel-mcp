import "dotenv/config";
import SpotifyServer from "./services/spotifyServer.js";

const server = new SpotifyServer();
server.run().catch(console.error);
