import { Request, Response, NextFunction } from "express";

export class NotFoundFilter {
    catch(err: any, req: Request, res: Response, next: NextFunction) {
        if (err.message?.includes('not found')) {
            return res.status(404).json({
                statusCode: 404,
                error: 'Not Found',
                message: err.message,
            });
        }

        return next(err);
    }
}