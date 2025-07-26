// import 'reflect-metadata';
// import { container, Factory } from "./core";
// import { UsersModule } from "./app/features/users/users.module";
//
// const app = Factory([UsersModule])
//
// const port = 8081;
//
// app.listen(port, () => console.log(`Mini-Nest listening on http://localhost:${port}`));
import 'reflect-metadata';
class Foo {
}
class Bar {
    foo;
    constructor(foo) {
        this.foo = foo;
    }
}
console.log('design:paramtypes on Bar:', Reflect.getMetadata('design:paramtypes', Bar));
