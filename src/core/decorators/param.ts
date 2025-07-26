import { ArgumentMetadata, PipesType } from "../types";

export function Param(data?: string, ...pipes: PipesType[]) {
    return function (target: any, methodName: string, index: number) {
        const ps = Reflect.getMetadata('design:paramtypes', target, methodName) ?? [];
        const metatype = ps[index];

        const params: Array<ArgumentMetadata> = Reflect.getMetadata('mini:params', target.constructor) ?? [];
        params.push({index, metatype, type: 'param', data, name: methodName});

        Reflect.defineMetadata('mini:params', params, target.constructor);


        if (pipes.length > 0) {
            const allParamPipes: Record<number, PipesType[]> =
                Reflect.getMetadata('mini:param_pipes', target.constructor, methodName) ?? {};
            allParamPipes[index] = pipes;
            Reflect.defineMetadata('mini:param_pipes', allParamPipes, target.constructor, methodName);
        }
    };
}

export function Body() {
    return function (target: any, name: string, idx: number) {
        const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
        console.log(
            "Body decorator metadata:",
            ps.map((t: any) => t?.name ?? t)
        );
        const metatype = ps[idx];
        const params: Array<ArgumentMetadata> = Reflect.getMetadata('mini:params', target.constructor) ?? [];
        params.push({index: idx, type: 'body', metatype, name});
        Reflect.defineMetadata('mini:params', params, target.constructor);
    };
}

export function Query(data: string) {
    return function (target: any, name: string, idx: number) {
        const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
        const metatype = ps[idx];
        const params: Array<ArgumentMetadata> =
            Reflect.getMetadata('mini:params', target.constructor) ?? [];
        params.push({index: idx, type: 'query', metatype, data, name});
        Reflect.defineMetadata('mini:params', params, target.constructor);
    };
}
