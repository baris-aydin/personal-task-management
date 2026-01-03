import express from "express";
import cors from "cors";
import { config } from "./config";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/tasks";
import listRoutes from "./routes/lists";
import { notFound, errorHandler } from "./middleware/error";

export function createApp() {
  const app = express();

  app.use(cors({ origin: config.corsOrigin, credentials: false }));
  app.use(express.json());

  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/lists", listRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
