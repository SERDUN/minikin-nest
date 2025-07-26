import { z } from "zod";

export const CreateUserDto = z.object({
    name: z.string().min(1),
    email: z.string().email()
});

export type User = z.infer<typeof CreateUserDto>;
