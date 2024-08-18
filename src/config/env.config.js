import { configDotenv } from "dotenv";
import { cleanEnv, makeValidator, num, port, str } from "envalid";

configDotenv({
  path: "./.env",
});

const cors = makeValidator((value) => {
  if (!value) return ["*"];
  return value.split(",");
});

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ["development", "production"],
    default: "development",
  }),
  PORT: port({ default: 3333 }),
  CORS_ORIGIN: cors(),

  REDIS_HOST: str({ default: "localhost" }),
  REDIS_PORT: num({ default: 6379 }),
  REDIS_PASSWORD: str({ default: "" }),
  REDIS_DB: num({ default: 0 }),
});

export default env;
