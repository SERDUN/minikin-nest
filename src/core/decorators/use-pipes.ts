import { container } from "../container";
import { ArgumentMetadata, PipesType, PipeTransform } from "../types";
import { isClass } from "../utils";

export const PIPES_METADATA = Symbol('pipes');

export function UsePipes(
    ...pipes: PipesType[]      // посилання на класи-пайпи
): ClassDecorator & MethodDecorator {
    return (target: any, key?: string | symbol) => {
        const where = key ? target[key] : target;
        Reflect.defineMetadata(PIPES_METADATA, pipes, where);
    };
}

/** Збирає глобальні + класові + метод-пайпи у правильному порядку */
export function getPipes(
    handler: Function,
    controller: Function,
    globalPipes: PipesType[] = [],
): PipesType[] {
    const classPipes = Reflect.getMetadata(PIPES_METADATA, controller) ?? [];
    const methodPipes = Reflect.getMetadata(PIPES_METADATA, handler) ?? [];
    return [...globalPipes, ...classPipes, ...methodPipes];
}

export async function runPipes(
    controllerCls: Function,
    handler: Function,
    value: unknown,
    meta: ArgumentMetadata,
    pipes: PipesType[] = []
) {
    let transformed = value;

    for (const PipeCtor of pipes) {
        const pipeInstance = isClass(PipeCtor)
            ? container.resolve<PipeTransform>(PipeCtor)
            : PipeCtor;

        if (!pipeInstance || typeof pipeInstance.transform !== 'function') {
            throw new Error(`Invalid pipe for argument: ${meta.data}`);
        }

        transformed = await Promise.resolve(
            pipeInstance.transform(transformed, meta)
        );
    }
    return transformed;
}