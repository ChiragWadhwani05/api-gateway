import { Router } from "express";
import { proxyMiddleware } from "../middlewares/proxy.middleware.js";
import { routeCheckMiddleware } from "../middlewares/routeCheck.middleware.js";

function createAuthV1Router() {
  const router = Router();

  router.use(
    routeCheckMiddleware(
      new Set([
        "/register/check-availability:GET",
        "/register/send-verification-email:POST",
        "/register/verify-and-create:POST",
        "/login:POST",
        "/logout:POST",
        "/tokens:POST",
        "/tokens/access-token:POST",
        "/google:GET",
        "/google/callback:GET",
        "/password/forgot:POST",
        "/password/reset:POST",
        "/password/change:POST",
      ])
    )
  );

  router.route("/register/check-availability").get();
  router.route("/register/send-verification-email").post();
  router.route("/register/verify-and-create").post();
  router.route("/login").post();
  router.route("/logout").post();

  router.route("/tokens").post();
  router.route("/tokens/access-token").post();

  router.route("/google").get();
  router.route("/google/callback").get();

  router.route("/password/forgot").post();
  router.route("/password/reset").post();
  router.route("/password/change").post();

  router.use(proxyMiddleware("authService", "v1", "auth"));

  return router;
}

export { createAuthV1Router };
