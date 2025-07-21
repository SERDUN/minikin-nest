import { Controller, Delete, Get, Post } from "../../../core";
import { Param } from "../../../core/decorators/param";

@Controller('/users')
export class UsersController {
    @Get('/')
    list() {
        return "users list";
    }

    @Get('/:id')
    getUser(id: string) {
        return `user ${id}`;
    }

    @Post('/')
    createUser(user: any) {
        return `user created with data: ${JSON.stringify(user)}`;
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: string) {
        return `user ${id} deleted`;
    }
}
