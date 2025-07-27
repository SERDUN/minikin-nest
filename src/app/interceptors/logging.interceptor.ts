import { Request, Response, NextFunction } from 'express';
import { Injectable } from "../../core";

@Injectable()
export class LoggingInterceptor {
    async intercept(req: Request, res: Response, next: NextFunction) {
        console.log(`[${req.method}] ${req.originalUrl}`);
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`→ Response took ${duration}ms`);
        });
        next();
    }
}
