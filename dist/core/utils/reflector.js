var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import 'reflect-metadata';
import { Injectable } from '../decorators';
/**
 * A utility service that provides convenient access to metadata
 * stored via decorators using the `reflect-metadata` library.
 */
let Reflector = class Reflector {
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
    get(metadataKeyOrDecorator, target) {
        const metadataKey = metadataKeyOrDecorator.KEY ??
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
    getAllAndOverride(key, targets) {
        for (const target of targets) {
            const value = this.get(key, target);
            if (value !== undefined)
                return value;
        }
        return undefined;
    }
};
Reflector = __decorate([
    Injectable()
], Reflector);
export { Reflector };
