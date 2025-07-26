import { ErrorRequestHandler, Request, Response } from "express";
import { resolveIfClass } from "../container";
import { FilterType, getFilters } from "../decorators";
import { Type } from "../types";

/**
 * FiltersMiddleware applies exception filters to any unhandled error.
 * Supports global, controller-level and method-level filters.
 */
export const FiltersMiddleware = (
    controller: Type,
    handler: Function,
    globalFilters: FilterType[] = []
): ErrorRequestHandler => {
    return async (err, req: Request, res: Response, _next) => {
        err.stack = undefined;

        const filters = getFilters(handler, controller, globalFilters);

        for (const filter of filters) {
            const instance = resolveIfClass(filter);

            if (typeof instance.catch === 'function') {
                await instance.catch(err, req, res, _next);
                if (res.headersSent) return;
            }
        }

        res.status((err as any)?.status || 500).json({
            error: err.message || 'Internal server error',
        });
    };
};
