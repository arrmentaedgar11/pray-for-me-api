import { Router } from "express";

const router = Router();

//readiness check
router.get("/health", (_req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

export default router;
