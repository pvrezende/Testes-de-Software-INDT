import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

interface JwtConfig {
  access: {
    secret: string;
    expiresIn: string; 
  };
  refresh: {
    secret: string;
    expiresIn: string;
  };
}

function getEnvOrThrow(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente ${name} não definida`);
  }
  return value;
}

export const jwtConfig = {
  access: {
    secret: getEnvOrThrow("JWT_ACCESS_SECRET"),
    expiresIn: getEnvOrThrow("JWT_ACCESS_EXPIRATION") as SignOptions["expiresIn"], 
  },
  refresh: {
    secret: getEnvOrThrow("JWT_REFRESH_SECRET"),
    expiresIn: getEnvOrThrow("JWT_REFRESH_EXPIRATION") as SignOptions["expiresIn"],
  },
};