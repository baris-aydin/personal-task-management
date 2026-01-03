import dotenv from "dotenv";
dotenv.config();

function must(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export const config = {
  port: Number(process.env.PORT ?? 5000),
  mongoUri: must("MONGO_URI"),
  jwtSecret: must("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:5173",
};
