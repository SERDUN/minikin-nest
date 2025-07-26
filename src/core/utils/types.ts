import { Paramtype } from "./extract";

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
