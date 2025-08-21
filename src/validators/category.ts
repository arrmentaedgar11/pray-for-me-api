import { z } from "zod";

export const createCategoryBody = z.object({
  name: z.string().min(1, "Category name is required").max(60, "Name too long"),
});

export type CreateCategoryBody = z.infer<typeof createCategoryBody>;
