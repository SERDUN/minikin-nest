import {
    Request,
    Response,
    NextFunction,
    RequestHandler,
    ErrorRequestHandler
} from 'express';

/**
 * Wraps both standard and error Express middlewares to support async/await.
 *
 * - Detects if the function is an error middleware via its arity (`fn.length === 4`)
 * - Automatically forwards any thrown or rejected errors to `next(err)`
 * - Allows using async functions in both route and error handlers
 */
export function asyncHandler<T extends RequestHandler | ErrorRequestHandler>(fn: T): T {
    if (fn.length === 4) {
        return (function (err: any, req: Request, res: Response, next: NextFunction) {
            Promise.resolve((fn as ErrorRequestHandler)(err, req, res, next)).catch(next);
        }) as T;
    }

    return (function (req: Request, res: Response, next: NextFunction
    ) {
        Promise.resolve((fn as RequestHandler)(req, res, next)).catch(next);
    }) as T;
}