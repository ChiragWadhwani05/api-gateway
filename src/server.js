import env from "./config/env.config.js";
import redisClient from "./services/redis.services.js";
import { startApp } from "./app.js";

/**
 * @description Starts the server with the dependencies and returns the Express app.
 *
 * @return {Promise<import("express").Express>}
 */
async function startServer() {
  try {
    await redisClient.connect();

    return startApp();
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

/**
 * Graceful shutdown
 * @param {import('http').Server} server
 */
function shutdown(server) {
  if (process.listenerCount("SIGTERM") === 0) {
    process.on("SIGTERM", () => {
      server.close(async () => {
        console.log("HTTP server closed.");
        await redisClient.disconnect();
        process.exit(0);
      });
    });
  }

  if (process.listenerCount("SIGINT") === 0) {
    process.on("SIGINT", () => {
      server.close(async () => {
        console.log("HTTP server closed.");
        await redisClient.disconnect();
        process.exit(0);
      });
    });
  }
}

(async () => {
  try {
    const app = await startServer();

    const PORT = env.PORT;
    const server = app.listen(PORT, () => {
      console.log("\n⚙️ Server is running on port:", PORT);
    });

    shutdown(server);
  } catch (error) {
    console.error("Failed to listen server:", error);
    process.exit(1);
  }
})();

export { startServer };
