import { ErrorRequestHandler } from "express";
import { Type } from "../utils";

export const FiltersMiddleware = (controller: Type, handler: Function, filters: Array<Type>): ErrorRequestHandler => {
    return (err, req, res, _next) => {
        err.stack = undefined;
        res.status((err as Error & { status: number }).status || 500).json({error: err.message || 'Server error'});
    }
}
