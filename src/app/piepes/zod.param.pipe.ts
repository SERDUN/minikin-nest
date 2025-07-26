// src/pipes/zod.pipe.factory.ts

import { ZodSchema } from "zod";
import { PipeTransform } from "../../core/decorators/use-pipes";
import { Type } from "../../core/utils";
import { ZodValidationPipe } from "./zod.pipe";

// Створює інстанс пайпа (без DI)
export function createZodPipe(schema: ZodSchema): PipeTransform {
    return {
        async transform(value: any, meta: any) {
            const result = schema.safeParse(value);
            if (!result.success) {
                throw new Error(
                    `Validation failed for ${meta.type}${meta.data ? ` (${meta.data})` : ''}: ` +
                    result.error.issues.map(i => i.message).join('; ')
                );
            }
            return result.data;
        }
    };
}

// Повертає DI-сумісний клас пайпа (для використання через container.resolve)
export function useZodPipe(schema: ZodSchema): Type<PipeTransform> {
    return class extends ZodValidationPipe {
        constructor() {
            super(schema);
        }
    };
}