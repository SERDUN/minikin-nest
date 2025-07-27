import { Request, Response, NextFunction } from "express";

export class InternalServerErrorFilter {
    catch(err: any, req: Request, res: Response, next: NextFunction) {
        return res.status(500).json({
            statusCode: 500,
            error: 'Internal Server Error',
            message: err.message ?? 'Unexpected error occurred',
        });
    }
}