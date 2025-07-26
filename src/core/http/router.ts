import express from 'express';
import { container } from '../container';
import { get } from "../utils";
import { asyncHandler } from "./async.handler";
import { HandlerMiddleware } from "./handler.middleware";
import { GuardsMiddleware } from "./guards.middleware";
import { FiltersMiddleware } from "./filters.middleware";

export function Factory(modules: any[]) {
    const app = express();

    app.use(express.json());

    const expressRouter = express.Router();

    const listen = (port: number, callback?: () => void) => {
        for (const module of modules) {
            const meta = get('mini:module', module);
            console.log('Registering module:', meta);

            if (!meta) continue;

            for (const provider of meta.providers ?? []) {
                console.log('Registering provider:', provider);
                container.register(provider, provider);
            }

            for (const controller of meta.controllers ?? []) {

                container.register(controller, controller)

                const prefix = get('mini:prefix', controller) ?? '';
                const routes = get('mini:routes', controller) ?? [];

                const instance = container.resolve(controller) as InstanceType<typeof controller>;

                // router.handlerName: route method name, e.g., getUser and defined by @Get('/user.ts')
                routes.forEach((router: any) => {
                    const handler = instance[router.handlerName] as (...args: any[]) => Promise<any>;

                    const path = prefix + router.path;

                    (expressRouter as any)[router.method](
                        path,
                        asyncHandler(GuardsMiddleware(controller, handler, [])),
                        asyncHandler(HandlerMiddleware(instance, handler, [])),
                        asyncHandler(FiltersMiddleware(controller, handler, [])),
                    );
                });
            }
        }

        app.listen(port, callback);
    }

    app.use(expressRouter);

    return {
        get: container.resolve,
        listen,
        use: (path: string, handler: express.RequestHandler) => {
            app.use(path, handler);
        },
    }
}
