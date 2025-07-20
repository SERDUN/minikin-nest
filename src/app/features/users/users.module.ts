import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { Module } from "../../../core";

@Module({
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {
}
