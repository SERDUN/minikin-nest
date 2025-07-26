import { ArgumentMetadata } from "../utils";

export function Param(data?: string) {
    return function (target: any, name: string, idx: number) {
        const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
        const metatype = ps[idx];
        const params: Array<ArgumentMetadata> =
            Reflect.getMetadata('mini:params', target.constructor) ?? [];
        params.push({index: idx, metatype, type: 'param', data, name});
        Reflect.defineMetadata('mini:params', params, target.constructor);
    };
}

export function Body() {
    return function (target: any, name: string, idx: number) {
        const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
        console.log(
            "Body decorator metadata:",
            ps.map((t: any) => t?.name ?? t)
        );        const metatype = ps[idx];
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
