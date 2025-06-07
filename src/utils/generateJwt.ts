import jwt from "jsonwebtoken";
import { config } from "../config/gitConfig";

export const generateAppJWT = (): string => {
  const payload = {
    iat: Math.floor(Date.now() / 1000) - 60,
    exp: Math.floor(Date.now() / 1000) + 10 * 60,
    iss: config.appId,
  };

  return jwt.sign(payload, config.privateKey, { algorithm: "RS256" });
};