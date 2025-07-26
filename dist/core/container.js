import 'reflect-metadata';
export class Container {
    // Map to hold registered classes/types and their tokens
    #registered = new Map();
    // Map to hold singleton instances
    #singletons = new Map();
    resolve(token) {
        if (this.#singletons.has(token))
            return this.#singletons.get(token);
        const cs = this.#registered.get(token);
        if (!cs) {
            throw new Error(`Token ${token.name} is not registered.`);
        }
        const deps = Reflect.getMetadata("design:paramtypes", token) || [];
        console.log("Resolving dependencies for:", token.name, "with dependencies:", deps);
        const resolved = new cs(...deps.map(d => {
            if (d === token) {
                throw new Error(`Circular dependency detected for token ${token.name}.`);
            }
            return this.resolve(d);
        }));
        this.#singletons.set(token, resolved);
        return resolved;
    }
    register(token, member) {
        if (this.#registered.has(token)) {
            throw new Error(`Token ${token.name} is already registered.`);
        }
        this.#registered.set(token, member);
    }
}
export const container = new Container();
