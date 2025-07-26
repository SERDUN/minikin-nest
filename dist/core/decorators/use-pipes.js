import { container } from "../container";
import { isClass } from "../utils";
export const PIPES_METADATA = Symbol('pipes');
export function UsePipes(...pipes // посилання на класи-пайпи
) {
    return (target, key) => {
        const where = key ? target[key] : target;
        Reflect.defineMetadata(PIPES_METADATA, pipes, where);
    };
}
/** Збирає глобальні + класові + метод-пайпи у правильному порядку */
export function getPipes(handler, controller, globalPipes = []) {
    const classPipes = Reflect.getMetadata(PIPES_METADATA, controller) ?? [];
    const methodPipes = Reflect.getMetadata(PIPES_METADATA, handler) ?? [];
    return [...globalPipes, ...classPipes, ...methodPipes];
}
export async function runPipes(controllerCls, handler, value, meta, pipes = []) {
    let transformed = value;
    for (const PipeCtor of pipes) {
        const pipeInstance = isClass(PipeCtor)
            ? container.resolve(PipeCtor)
            : PipeCtor;
        if (!pipeInstance || typeof pipeInstance.transform !== 'function') {
            throw new Error(`Invalid pipe for argument: ${meta.data}`);
        }
        transformed = await Promise.resolve(pipeInstance.transform(transformed, meta));
    }
    return transformed;
}
