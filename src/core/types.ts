import { Request } from 'express';

export type PipesType = Type<PipeTransform> | InstanceType<Type<PipeTransform>>;

export type Paramtype = 'body' | 'query' | 'param' | 'header' | 'cookie' | 'file' | 'files';

// This file defines types and interfaces used in the Minikin Nest framework for argument metadata and type definitions.
export interface Type<T = any> extends Function {
    new(...args: any[]): T;
}

// This interface represents metadata about an argument in a method, including its index, type, and optional metadata.
export interface ArgumentMetadata {
    readonly index: number;         // позиція аргументу у методі
    readonly type: Paramtype;            // де “живе” значення
    readonly metatype?: Type            // його TS-тип (якщо є)
    readonly data?: string;             // @Body('userId') → 'userId'
    readonly name?: string;             // ім'я функції-методу, якщо декоратор використовується на методі
}

export interface PipeTransform<T = any, R = any> {
    transform(value: T, metadata: ArgumentMetadata): R | Promise<R>;
}

export const extractParams = (Req: Request, type: Paramtype) => {
    switch (type) {
        case 'body':
            return Req.body;
        case 'query':
            return Req.query;
        case 'param':
            return Req.params;
        case 'header':
            return Req.headers;
        case 'cookie':
            return Req.cookies;
        case 'file':
            return (Req as any).file;
        case 'files':
            return (Req as any).files;
        default:
            throw new Error(`Unknown param type: ${type}`);
    }
}
