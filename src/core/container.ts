import 'reflect-metadata';

export class Container {
    // Map to hold registered classes/types and their tokens
    #registered = new Map();
    // Map to hold singleton instances
    #singletons = new Map();

    resolve<T>(token: new (...args: any[]) => T): T {
        if (this.#singletons.has(token)) return this.#singletons.get(token);
        const targetClass = this.#registered.get(token);
        if (!targetClass) {
            throw new Error(`Token ${token.name} is not registered.`);
        }

        const deps: any[] = Reflect.getMetadata("design:paramtypes", token) || [];

        // If the token is not registered, throw an error
        // If the token is registered, resolve its dependencies
        // and create a new instance of the class
        const resolved = new targetClass
        (...deps.map(d => {
            if (d === token) {
                throw new Error(`Circular dependency detected for token ${token.name}.`);
            }

            return this.resolve(d)
        }));

        this.#singletons.set(token, resolved);
        return resolved;
    }

    register<T extends Function>(token: T, member: T): void {
        if (this.#registered.has(token)) {
            throw new Error(`Token ${token.name} is already registered.`);
        }

        this.#registered.set(token, member);
    }
}

export const container = new Container();
