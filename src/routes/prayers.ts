import { Router } from "express";
import { getPool } from "../db/pool";
import { paginationQuery } from "../validators/pagination";
import { createPrayerBody, listPrayersQuery, updatePrayerBody } from "../validators/prayers";
import { PrayerService } from "../services/prayer.service";

const router = Router();
const service = new PrayerService(getPool());


router.get("/", async (req, res, next) => {
  try {
    const { limit, offset } = paginationQuery.parse(req.query);
    const { status, category, is_private } = listPrayersQuery.parse(req.query);
    const result = await service.list({ status, category, is_private, limit, offset });
    res.json({ ...result, hasMore: result.total > offset + limit, nextOffset: offset + limit });
  } catch (err) {
    next(err);
  }
});


router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const prayer = await service.get(id);
    if (!prayer) return res.status(404).json({ message: "Prayer not found" });
    const categories = await service.categories(id);
    res.json({ ...prayer, categories });
  } catch (err) {
    next(err);
  }
});


router.post("/", async (req, res, next) => {
  try {
    const body = createPrayerBody.parse(req.body);
    const created = await service.create(body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});


router.put("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const patch = updatePrayerBody.parse(req.body);
    const updated = await service.update(id, patch);
    if (!updated) return res.status(404).json({ message: "Prayer not found" });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});


router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await service.remove(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});


router.post("/:id/pray", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const prayed_count = await service.incrementPrayedCount(id);
    if (prayed_count == null) return res.status(404).json({ message: "Prayer not found" });
    res.json({ prayed_count });
  } catch (err) {
    next(err);
  }
});

export default router;
