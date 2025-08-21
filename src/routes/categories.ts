import { Router } from "express";
import { getPool } from "../db/pool";
import { CategoryService } from "../services/category.service";
import { createCategoryBody } from "../validators/category";

const router = Router();
const service = new CategoryService(getPool());


router.get("/", async (_req, res, next) => {
  try {
    res.json(await service.list());
  } catch (err) {
    next(err);
  }
});


router.post("/", async (req, res, next) => {
  try {
    const body = createCategoryBody.parse(req.body);
    const created = await service.create(body.name);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

export default router;
