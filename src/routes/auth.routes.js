import { Router } from "express";
import { proxyMiddleware } from "../middlewares/proxy.middleware.js";
import { routeCheckMiddleware } from "../middlewares/routeCheck.middleware.js";

function createAuthV1Router() {
  const router = Router();

  router.use(routeCheckMiddleware(new Set(["register:POST", "login:POST"])));

  router.route("/register").post();
  router.route("/login").post();

  router.use(proxyMiddleware("authService", "v1", "auth"));

  return router;
}

export { createAuthV1Router };
