import { Router } from "express";
import { createAuthV1Router } from "./auth.routes.js";
import { createUserV1Router } from "./user.routes.js";

function createRouter() {
  const router = Router();

  router.use("/v1", createV1Router());

  return router;
}

function createV1Router() {
  const router = Router();

  router.use("/auth", createAuthV1Router());
  router.use("/users", createUserV1Router());

  return router;
}

export { createRouter };
