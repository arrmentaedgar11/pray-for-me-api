import { z } from "zod";


export const createCommentBody = z.object({
display_name: z.string().min(1).max(60),
content: z.string().min(1),
});
export type CreateCommentBody = z.infer<typeof createCommentBody>;