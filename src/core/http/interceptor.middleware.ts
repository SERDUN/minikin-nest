import { Request, Response, NextFunction } from 'express';
import { resolveIfClass } from '../container';
import { Type } from '../types';
import { getInterceptors, InterceptorType } from "../decorators/use-interceptors";

export function InterceptorsMiddleware(
    controller: Type,
    handler: Function,
    globalInterceptors: InterceptorType[] = []
) {
    const interceptors = getInterceptors(handler, controller, globalInterceptors);

    return async (req: Request, res: Response, next: NextFunction) => {
        let idx = -1;

        const runNext = async () => {
            idx++;
            if (idx >= interceptors.length) return next();

            const interceptor = interceptors[idx];
            const instance = resolveIfClass(interceptor);

            if (typeof instance.intercept !== 'function') {
                throw new Error(`Interceptor missing intercept(): ${instance?.constructor?.name}`);
            }

            await instance.intercept(req, res, runNext);
        };

        await runNext();
    };
}