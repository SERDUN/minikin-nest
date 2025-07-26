export function Param(data) {
    return function (target, name, idx) {
        const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
        const metatype = ps[idx];
        const params = Reflect.getMetadata('mini:params', target.constructor) ?? [];
        params.push({ index: idx, metatype, type: 'param', data, name });
        Reflect.defineMetadata('mini:params', params, target.constructor);
    };
}
export function Body() {
    return function (target, name, idx) {
        const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
        const metatype = ps[idx];
        const params = Reflect.getMetadata('mini:params', target.constructor) ?? [];
        params.push({ index: idx, type: 'body', metatype, name });
        Reflect.defineMetadata('mini:params', params, target.constructor);
    };
}
export function Query(data) {
    return function (target, name, idx) {
        const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
        const metatype = ps[idx];
        const params = Reflect.getMetadata('mini:params', target.constructor) ?? [];
        params.push({ index: idx, type: 'query', metatype, data, name });
        Reflect.defineMetadata('mini:params', params, target.constructor);
    };
}
