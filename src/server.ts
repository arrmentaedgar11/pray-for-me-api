import express from "express";
import categoriesRouter from "./routes/categories";
import prayersRouter from "./routes/prayers";
import commentsRouter from "./routes/comments";
import { notFound } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";

const app = express();

// Parse JSON
app.use(express.json());

// Health check (fix 'status' typo)
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Mount routers
app.use("/api/categories", categoriesRouter);
app.use("/api/prayers", prayersRouter);

// ⛳ IMPORTANT: mount at /api (not /api/comments)
// so routes declared as "/prayers/:id/comments" and "/comments/:id/like" match Postman:
//   POST /api/prayers/:id/comments
//   GET  /api/prayers/:id/comments
//   POST /api/comments/:id/like
//   DELETE /api/comments/:id
app.use("/api", commentsRouter);

// 404 + error handlers (after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
