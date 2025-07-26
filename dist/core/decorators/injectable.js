import { container } from "../container";
export function Injectable(token) {
    return function (target) {
        const actualToken = token || target;
        container.register(actualToken, target);
    };
}
