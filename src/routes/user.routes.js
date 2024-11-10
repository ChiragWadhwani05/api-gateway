import { Router } from "express";
import { proxyMiddleware } from "../middlewares/proxy.middleware.js";
import { routeCheckMiddleware } from "../middlewares/routeCheck.middleware.js";
import { verifyToken } from "../middlewares/authenticate.middleware.js"; // Import the verifyToken middleware

function createUserV1Router() {
  const router = Router();

  // Use the verifyToken middleware for all routes
  router.use(verifyToken);

  router.use(
    routeCheckMiddleware(
      new Set(["/getSelf:GET", "/getUser:GET", "/health:GET"])
    )
  );

  router.route("/getSelf").get();
  router.route("/getUser").get();
  router.route("/health").get();

  router.use(proxyMiddleware("userService", "v1", "user"));
  return router;
}

export { createUserV1Router };
