import express from "express";
import cors from "cors";
import morgan from "morgan";

import health from "./routes/health";
import categoryRoutes from "./routes/categories";
import prayerRoutes from "./routes/prayers";
import commentRoutes from "./routes/comments";

import { notFound } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan("dev"));

  // Mount everything under /api
  app.use("/api", health);           
  app.use("/api", categoryRoutes);  
  app.use("/api/prayers", prayerRoutes);     
  app.use("/api/comments", commentRoutes);    // 

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
