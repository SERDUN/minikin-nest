import { ExpressExecutionContext } from "../utils";
import { container } from "../container";
export const GUARDS_METADATA = Symbol('guards');
/**
 * @UseGuards(AuthGuard, RolesGuard)
 * Записує список guard-класів у метадані методу/класу.
 */
export function UseGuards(...guards // посилання на класи Guard-ів
) {
    return (target, key) => {
        if (key) {
            //  ➜ метод
            Reflect.defineMetadata(GUARDS_METADATA, guards, target[key]);
        }
        else {
            //  ➜ клас-контролер
            Reflect.defineMetadata(GUARDS_METADATA, guards, target);
        }
    };
}
const getGuards = (handler, controllerClass, globalGuards = []) => {
    const controllerGuards = Reflect.getMetadata(GUARDS_METADATA, controllerClass) ?? [];
    const routeGuards = Reflect.getMetadata(GUARDS_METADATA, handler) ?? [];
    globalGuards.push(...controllerGuards, ...routeGuards);
    return globalGuards;
};
export async function runGuards(controllerClass, handler, req, res, globalGuards = []) {
    const guards = getGuards(handler, controllerClass, globalGuards);
    console.log({ guards });
    for (const GuardCtor of guards) {
        // інстанціюємо через IoC (підтримка @Injectable() всередині Guard-а)
        const guardInstance = container.resolve(GuardCtor);
        // Створюємо context «на льоту»
        const ctx = new ExpressExecutionContext(controllerClass, handler, req, res);
        const can = await Promise.resolve(guardInstance.canActivate(ctx));
        console.log({ can, GuardCtor });
        if (!can)
            return GuardCtor.name;
    }
    return true;
}
