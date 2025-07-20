import { ZodSchema } from 'zod';
import { PipeTransform } from "../../core/decorators/use-pipes";
import { ArgumentMetadata } from "../../core/utils";

export class ZodValidationPipe implements PipeTransform<any, any> {
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
