import { Type } from '../types';

/**
 * Key used to store and retrieve interceptors metadata via Reflect API.
 * Applied at class or method level using the @UseInterceptor() decorator.
 * Interceptors allow pre- and post-processing logic before a handler is executed.
 */
export const INTERCEPTORS_METADATA = Symbol('interceptors');

export type InterceptorType = Type | object;

export function UseInterceptor(...interceptors: InterceptorType[]): ClassDecorator & MethodDecorator {
    return (target: any, key?: string | symbol) => {
        const where = key ? target[key] : target;
        const existing: InterceptorType[] = Reflect.getMetadata(INTERCEPTORS_METADATA, where) ?? [];
        Reflect.defineMetadata(INTERCEPTORS_METADATA, [...existing, ...interceptors], where);
    };
}

export function getInterceptors(
    handler: Function,
    controller: Function,
    globalInterceptors: InterceptorType[] = [],
): InterceptorType[] {
    const method = Reflect.getMetadata(INTERCEPTORS_METADATA, handler) ?? [];
    const controllerLevel = Reflect.getMetadata(INTERCEPTORS_METADATA, controller) ?? [];
    return [...method, ...controllerLevel, ...globalInterceptors];
}