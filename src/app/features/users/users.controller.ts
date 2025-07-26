import { Controller, Get, Post, Delete } from "../../../core";
import { z } from "zod";
import { UsersService } from "./users.service";
import { ZodValidationPipe } from "../../piepes";
import { Body, Param, Query } from "../../../core/decorators/param";
import { UsePipes } from "../../../core/decorators/use-pipes";

const CreateUserDto = z.object({
    name: z.string().min(1),
    email: z.string().email()
});

export type User = z.infer<typeof CreateUserDto>;


@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get('/')
    list() {
        return this.usersService.findAll();
    }

    @Get('/:id')
    getUser(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Post('/')
    @UsePipes(new ZodValidationPipe(CreateUserDto))
    createUser(@Body() user: User) {
        console.log("Creating user:", user);
        return this.usersService.create(user);
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: string) {
        return this.usersService.delete(id);
    }
}
