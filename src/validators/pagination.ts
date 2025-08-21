import { z } from "zod";


export const paginationQuery = z.object({
limit: z.preprocess(
(v) => (v === undefined ? 20 : Number(v)),
z.number().int().min(1).max(100)
),
offset: z.preprocess(
(v) => (v === undefined ? 0 : Number(v)),
z.number().int().min(0)
),
});
export type PaginationQuery = z.infer<typeof paginationQuery>;