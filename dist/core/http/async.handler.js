/**
 * Wraps both standard and error Express middlewares to support async/await.
 *
 * - Detects if the function is an error middleware via its arity (`fn.length === 4`)
 * - Automatically forwards any thrown or rejected errors to `next(err)`
 * - Allows using async functions in both route and error handlers
 */
export function asyncHandler(fn) {
    if (fn.length === 4) {
        return (function (err, req, res, next) {
            Promise.resolve(fn(err, req, res, next)).catch(next);
        });
    }
    return (function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    });
}
