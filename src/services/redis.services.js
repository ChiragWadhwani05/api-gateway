import env from "../config/env.config.js";
import { Redis } from "ioredis";

class RedisClient {
  #redis = null;

  async connect() {
    if (this.#redis) {
      return;
    }

    const redis = new Redis({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      password: env.REDIS_PASSWORD,
      db: env.REDIS_DB,
      lazyConnect: true,
    });

    await redis.connect((err) => {
      if (err) {
        console.error("Redis connection error", err);
        process.exit(1);
      }

      console.log(`\n🟥 Redis connected! ${env.REDIS_HOST}:${env.REDIS_PORT}`);
    });
    this.#redis = redis;
  }

  /**
   *
   * @returns {Redis}
   */
  getInstance() {
    return this.#redis;
  }

  async disconnect() {
    if (this.#redis) {
      await this.#redis.quit();
      console.log(`🟥 Redis disconnected! ${env.REDIS_HOST}:${env.REDIS_PORT}`);
      this.#redis = null;
    }
  }
}

const redisClient = new RedisClient();
Object.freeze(redisClient);

export default redisClient;
