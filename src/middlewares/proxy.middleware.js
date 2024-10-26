import { createProxyMiddleware } from "http-proxy-middleware";
import services from "../config/services.config.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * @description Proxy requests to appropriate services based on API version and path.
 *
 * @param {string} serviceName - The name of the service (e.g. 'userService').
 * @param {string} version - The API version (e.g. 'v1', 'v2').
 * @param {string} suffix - The function of the service (eg. 'auth' or 'user').
 *
 * @returns {import("express").RequestHandler}
 */
function proxyMiddleware(serviceName, version = "v1", suffix = "") {
  const serviceUrl = services[version][serviceName];

  if (!serviceUrl) {
    throw new ApiError(
      500,
      `Service URL not configured for ${serviceName} in version ${version}`
    );
  }

  return asyncHandler(async (req, res, next) => {
    const proxy = createProxyMiddleware({
      target: `${serviceUrl}/${suffix}`,
      changeOrigin: true,
      on: {
        error(err) {
          console.error("Proxy error:", err);
          next(new ApiError(500));
        },
      },
    });

    await proxy(req, res, next);
  });
}

export { proxyMiddleware };
