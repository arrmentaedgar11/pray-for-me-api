import { Router } from "express";
import { getPool } from "../db/pool";
import { CommentService } from "../services/comment.service";
import { createCommentBody } from "../validators/comment";
import { paginationQuery } from "../validators/pagination";

const router = Router();
const service = new CommentService(getPool());


router.post("/prayers/:id/comments", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const body = createCommentBody.parse(req.body);
    const created = await service.create(id, body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

router.get("/prayers/:id/comments", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { limit, offset } = paginationQuery.parse(req.query);
    const result = await service.list(id, limit, offset);
    res.json({ ...result, hasMore: result.total > offset + limit, nextOffset: offset + limit });
  } catch (err) {
    next(err);
  }
});


router.post("/comments/:id/like", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const updated = await service.like(id);
    if (!updated) return res.status(404).json({ message: "Comment not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});


router.delete("/comments/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await service.remove(id);   // returns void
    res.status(204).send();     // no content
  } catch (err) {
    next(err);
  }
});


export default router;
