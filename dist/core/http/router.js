import express from 'express';
import { container } from '../container';
import { get } from "../utils";
export function Factory(modules) {
    const app = express();
    app.use(express.json());
    const expressRouter = express.Router();
    const listen = (port, callback) => {
        for (const module of modules) {
            const meta = get('mini:module', module);
            console.log('Registering module:', meta);
            if (!meta)
                continue;
            for (const provider of meta.providers ?? []) {
                console.log('Registering provider:', provider);
                container.register(provider, provider);
            }
            for (const controller of meta.controllers ?? []) {
                container.register(controller, controller);
                const prefix = get('mini:prefix', controller) ?? '';
                const routes = get('mini:routes', controller) ?? [];
                const instance = container.resolve(controller);
                console.log("Instance of controller:", instance);
                routes.forEach((router) => {
                    const handler = instance[router.handlerName];
                    const path = prefix + router.path;
                    console.log(`Registering route: ${router.method.toUpperCase()} ${path} -> ${router.handlerName} in ${controller.name}`);
                    expressRouter[router.method](path, handler);
                });
            }
        }
        app.listen(port, callback);
    };
    app.use(expressRouter);
    return {
        get: container.resolve,
        listen,
        use: (path, handler) => {
            app.use(path, handler);
        },
        useGlobalInterceptors: (interceptors) => {
            throw new Error('Interceptors are not implemented yet');
        },
    };
}
