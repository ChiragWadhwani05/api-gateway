import { ApiError } from "../utils/apiError.js";

/**
 * @description Middleware to check if the route and method are allowed.
 *
 * @param {Set<string>} allowedRoutes - A Set of allowed routes and methods.
 * @returns {import("express").RequestHandler}
 */
function routeCheckMiddleware(allowedRoutes) {
  return (req, res, next) => {
    let normalizedPath;

    if (req.path.endsWith("/")) {
      normalizedPath = req.path.slice(1, -1);
    } else {
      normalizedPath = req.path.slice(1);
    }

    const routeKey = `/${normalizedPath}:${req.method}`;

    if (allowedRoutes.has(routeKey)) {
      return next();
    }

    next(new ApiError(404, "Endpoint not found"));
  };
}

export { routeCheckMiddleware };
