import express from "express";
import env from "./config/env.config.js";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import redisClient from "./services/redis.services.js";
import { ApiError } from "./utils/apiError.js";
import { apiResponse } from "./utils/apiResponse.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { createRouter } from "./routes/index.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";

function startApp() {
  const app = express();

  // Disable x-powered-by header from express
  app.disable("x-powered-by");

  // Set security HTTP headers
  app.use(helmet());

  app.use(cookieParser());

  // CORS settings
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true,
      exposedHeaders: "*",
      methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
    })
  );

  // Rate limiting
  const limiterResponse = new ApiError(
    429,
    "Too many requests, please try again later."
  );
  const limiter = rateLimit({
    windowMs: 1000 * 60 * 1,
    max: 10,
    message: { ...limiterResponse, message: limiterResponse.message },
    legacyHeaders: false,
    standardHeaders: true,
    store: new RedisStore({
      sendCommand: (...args) => redisClient.getInstance().call(...args),
    }),
    handler: (req, res, next, options) => {
      console.log(`Rate limit exceeded for IP: ${req.ip}`);
      next(options);
    },
  });

  app.use(limiter);

  // Health check endpoint
  app.get("/health", (req, res) => {
    return res.status(200).json(apiResponse(200));
  });

  // Proxy Endpoints
  app.use("/api", createRouter());

  // Handle unknown endpoints
  app.use(
    "*",
    asyncHandler(() => {
      throw new ApiError(404, "Endpoint not found.");
    })
  );

  // Error handling middleware
  app.use(errorHandler);

  return app;
}

export { startApp };
