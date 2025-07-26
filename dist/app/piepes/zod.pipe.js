export class ZodValidationPipe {
    schema;
    constructor(schema) {
        this.schema = schema;
    }
    transform(value, meta) {
        try {
            return this.schema.parse(value);
        }
        catch (err) {
            throw new Error(`Validation failed for ${meta.type}${meta.data ? ` (${meta.data})` : ''}`);
        }
    }
}
