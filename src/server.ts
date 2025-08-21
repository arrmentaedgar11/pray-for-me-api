import express from "express";
import categoriesRouter from "./routes/categories";
import prayersRouter from "./routes/prayers";
import commentsRouter from "./routes/comments";
import { notFound } from "./middleware/not-found";
import { errorHandler } from "./middleware/error-handler";

const app = express();
app.use(express.json());

// Health
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// Mount routers
app.use("/api/categories", categoriesRouter); 
app.use("/api/prayers",    prayersRouter);    
app.use("/api/comments",            commentsRouter);   

// 404 & error handlers (keep AFTER routers)
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
