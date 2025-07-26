import { NextFunction, Request, Response } from "express";
import { runGuards } from "../decorators";
import { Type } from "../types";

export const GuardsMiddleware = (controller: Type, handler: Function, globalGuards: Array<Type> = []) => async (req: Request, res: Response, next: NextFunction) => {
    const guardResult = await runGuards(controller, handler, req, res, globalGuards);
    if (typeof guardResult !== 'string') {
        return next();
    }
    res.status(403).json({message: `Forbidden by ${guardResult}`});
}
