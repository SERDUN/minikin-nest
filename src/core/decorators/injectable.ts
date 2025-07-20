import { container } from "../container";

export function Injectable(token?: any) {
    return function (target: any) {
        const actualToken = token || target;
        container.register(actualToken, target); // ← тут виправлення
    };
}