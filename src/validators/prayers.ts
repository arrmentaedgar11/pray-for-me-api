import { z } from "zod";

export const listPrayersQuery = z.object({
  status: z.enum(["open", "answered", "closed"]).optional(),
  category: z.coerce.number().int().positive().optional(),
  is_private: z
    .union([z.literal("true"), z.literal("false")])
    .transform(v => v === "true")
    .optional(),
});

export const createPrayerBody = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  is_private: z.boolean().default(false),
  status: z.enum(["open", "answered", "closed"]).default("open"),
  categoryIds: z.array(z.number().int().positive()).default([]),
});

export const updatePrayerBody = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  is_private: z.boolean().optional(),
  status: z.enum(["open", "answered", "closed"]).optional(),
  categoryIds: z.array(z.number().int().positive()).optional(),
}).strict();
