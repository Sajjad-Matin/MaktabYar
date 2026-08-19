import jwt, { type SignOptions } from "jsonwebtoken";

const getSecret = () => {
  const value = process.env.JWT_SECRET;
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be configured in production.");
  }
  return value || "development-only-secret-change-me";
};

export interface JWTPayload {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
}

export const generateToken = (payload: JWTPayload): string =>
  jwt.sign(payload, getSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as SignOptions["expiresIn"],
  });

export const verifyToken = (token: string): JWTPayload =>
  jwt.verify(token, getSecret()) as JWTPayload;
