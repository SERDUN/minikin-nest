import { z } from "zod";

export const IdSchema = z.string().regex(/^\d+$/).transform(Number).refine(n => n > 0, {
    message: 'ID must be a positive integer',
});
