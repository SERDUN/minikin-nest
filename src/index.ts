import { container } from "./core";
import { UsersController } from "./features/users/users.controller";

container.register(UsersController, UsersController);
let userController = container.resolve(UsersController);
console.log(userController);