import { ZodSchema } from 'zod';
import { ArgumentMetadata, PipeTransform } from "../../core";

export class ZodValidationPipe implements PipeTransform {
    constructor(
        private readonly schema: ZodSchema
    ) {
    }

    transform(value: unknown, meta: ArgumentMetadata) {
        try {
            return this.schema.parse(value);
        } catch (err) {
            throw new Error(
                `Validation failed for ${meta.type}${meta.data ? ` (${meta.data})` : ''}`
            );
        }
    }
}


