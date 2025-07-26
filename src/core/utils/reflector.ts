import 'reflect-metadata';
import { Injectable } from '../decorators';
import { Type } from "./types";

/**
 * A utility service that provides convenient access to metadata
 * stored via decorators using the `reflect-metadata` library.
 */
@Injectable()
export class Reflector {
    /**
     * Retrieves metadata for a given key or decorator from the specified target.
     *
     * If a decorator with a static `KEY` property is passed, the method automatically
     * extracts that key and uses it to look up metadata.
     *
     * @template TResult The expected return type of the metadata.
     * @template TKey The type of the key or decorator.
     *
     * @param metadataKeyOrDecorator The metadata key (string or symbol), or a decorator with a `KEY` static property.
     * @param target The target object (e.g., class, method, or property) from which to retrieve metadata.
     * @returns The metadata value associated with the key, or `undefined` if not found.
     */
    public get<TResult = any, TKey = any>(
        metadataKeyOrDecorator: TKey,
        target: Type<any> | Function,
    ): TResult {
        const metadataKey =
            (metadataKeyOrDecorator as { KEY: string }).KEY ??
            metadataKeyOrDecorator;

        return Reflect.getMetadata(metadataKey, target);
    }

    /**
     * Attempts to retrieve metadata from a list of targets, returning the first non-undefined value.
     *
     * This is useful for resolving metadata with inheritance or method overrides,
     * where the same metadata key may appear in multiple targets (e.g., method, prototype, class).
     *
     * @template T The expected return type of the metadata.
     *
     * @param key The metadata key to search for.
     * @param targets An array of targets to search through, in priority order.
     * @returns The first non-undefined metadata value found, or `undefined` if none found.
     */
    getAllAndOverride<T = any>(
        key: string | symbol,
        targets: Array<Type<any> | Function>,
    ): T | undefined {
        for (const target of targets) {
            const value = this.get(key, target);
            if (value !== undefined) return value as T;
        }
        return undefined;
    }
}
