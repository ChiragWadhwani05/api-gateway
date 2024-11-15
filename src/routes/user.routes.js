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
      new Set(["/self|GET", "/:username|GET", "/health|GET"])
    )
  );

  router.route("/health").get();

  router.route("/self").get();
  router.route("/:username").get();

  router.use(proxyMiddleware("userService", "v1", "users"));
  return router;
}

export { createUserV1Router };
