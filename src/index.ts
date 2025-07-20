import { container } from "./core";
import { UsersController } from "./features/users/users.controller";
import { UsersService } from "./features/users/users.service";

// Directly registering UsersController
container.register(UsersController, UsersController);
let userController = container.resolve(UsersController);
console.log(userController);

// Registered by decorator
let userService = container.resolve(UsersService);
console.log(userService)