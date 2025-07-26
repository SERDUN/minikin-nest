export function Param(data, ...pipes) {
    return function (target, methodName, index) {
        const ps = Reflect.getMetadata('design:paramtypes', target, methodName) ?? [];
        const metatype = ps[index];
        const params = Reflect.getMetadata('mini:params', target.constructor) ?? [];
        params.push({ index, metatype, type: 'param', data, name: methodName });
        Reflect.defineMetadata('mini:params', params, target.constructor);
        if (pipes.length > 0) {
            const allParamPipes = Reflect.getMetadata('mini:param_pipes', target.constructor, methodName) ?? {};
            allParamPipes[index] = pipes;
            Reflect.defineMetadata('mini:param_pipes', allParamPipes, target.constructor, methodName);
        }
    };
}
export function Body() {
    return function (target, name, idx) {
        const ps = Reflect.getMetadata('design:paramtypes', target, name) ?? [];
        console.log("Body decorator metadata:", ps.map((t) => t?.name ?? t));
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
