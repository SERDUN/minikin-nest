import { Type } from "../types";

export const FILTERS_METADATA = Symbol('filters');

export type FilterType = Type | object; // class or instance


export function UseFilter(...filters: FilterType[]): ClassDecorator & MethodDecorator {
    return (target: any, key?: string | symbol) => {
        const existing: FilterType[] = Reflect.getMetadata(FILTERS_METADATA, key ? target[key] : target) ?? [];
        const merged = [...existing, ...filters];
        Reflect.defineMetadata(FILTERS_METADATA, merged, key ? target[key] : target);
    };
}

export function getFilters(
    handler: Function,
    controllerClass: Function,
    globalFilters: FilterType[] = [],
): FilterType[] {
    const controllerFilters = Reflect.getMetadata(FILTERS_METADATA, controllerClass) ?? [];
    const methodFilters = Reflect.getMetadata(FILTERS_METADATA, handler) ?? [];
    return [...globalFilters, ...controllerFilters, ...methodFilters];
}