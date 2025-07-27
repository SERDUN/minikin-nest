import express from 'express';
import { container } from '../container';
import { get } from "../utils";
import { asyncHandler } from "./async.handler";
import { HandlerMiddleware } from "./handler.middleware";
import { GuardsMiddleware } from "./guards.middleware";
import { FiltersMiddleware } from "./filters.middleware";
import { Type } from "../types";
import { FilterType } from "../decorators";

interface FactoryOptions {
    globalGuards?: Type[];
    globalPipes?: Type[];
    globalFilters?: Type[];
}

export function Factory(modules: any[], options: FactoryOptions = {}) {
    const app = express();

    app.use(express.json());

    const expressRouter = express.Router();

    const globalGuards: Array<Type> = [...(options.globalGuards ?? [])];
    const globalPipes: Array<Type> = [...(options.globalPipes ?? [])];
    const globalFilters: Array<FilterType> = [...(options.globalFilters ?? [])];

    const listen = (port: number, callback?: () => void) => {
        for (const module of modules) {
            const meta = get('mini:module', module);

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
                        asyncHandler(GuardsMiddleware(controller, handler, globalGuards)),
                        asyncHandler(HandlerMiddleware(instance, handler, globalPipes)),
                        asyncHandler(FiltersMiddleware(controller, handler, globalFilters)),
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
        useGlobalGuards: (...guards: Type[]) => {
            globalGuards.push(...guards);
        },
        useGlobalPipes: (...pipes: Type[]) => {
            globalPipes.push(...pipes);
        },
        useGlobalFilters: (...filters: FilterType[]) => {
            globalFilters.push(...filters);
        },
    };
}
