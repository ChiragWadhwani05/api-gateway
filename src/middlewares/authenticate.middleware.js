import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import env from "../config/env.config.js";

const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "No Authorization token found");
    }

    const decodedToken = jwt.verify(token, env.ACCESS_TOKEN_SECRET);

    req.headers["user-id"] = decodedToken._id;
    next();
  } catch (error) {
    throw new ApiError(401, error.message);
  }
});

export { verifyToken };
