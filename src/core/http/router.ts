import express from 'express';
import { container } from '../container';
import { get, Type } from "../utils";

export function Factory(modules: any[]) {
    const app = express();

    app.use(express.json());

    const router = express.Router();

    const listen = (port: number, callback?: () => void) => {
        for (const module of modules) {
            const meta = get('mini:module', module);
            if (!meta) continue;

            for (const controller of meta.controllers ?? []) {
                container.register(controller, controller)
                const prefix = get('mini:prefix', controller) ?? '';
                const routes = get('mini:routes', controller) ?? [];

                console.log("Registering controller:", controller.name + " with prefix:", prefix, "and routes:", routes);

                const instance = container.resolve(controller) as InstanceType<typeof controller>;

                routes.forEach((r: any) => {
                    const handler = instance[r.handlerName] as (...args: any[]) => Promise<any>;
                    const path = prefix + r.path;

                    (router as any)[r.method](path);
                });
            }
        }

        app.listen(port, callback);
    }

    app.use(router);

    return {
        get: container.resolve,
        listen,
        use: (path: string, handler: express.RequestHandler) => {
            app.use(path, handler);
        },
        useGlobalInterceptors: (interceptors: any[]) => {
            throw new Error('Interceptors are not implemented yet');
        },
    }
}
