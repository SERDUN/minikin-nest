import { Controller, Get, Post, Delete } from "../../../core";
import { z } from "zod";
import { UsersService } from "./users.service";
import { ZodValidationPipe } from "../../piepes";
import { Body, Param, Query } from "../../../core/decorators/param";
import { UsePipes } from "../../../core/decorators/use-pipes";
import { createZodPipe, useZodPipe } from "../../piepes/zod.param.pipe";

const CreateUserDto = z.object({
    name: z.string().min(1),
    email: z.string().email()
});


export const IdSchema = z.string().regex(/^\d+$/).transform(Number).refine(n => n > 0, {
    message: 'ID must be a positive integer',
});

export type User = z.infer<typeof CreateUserDto>;


@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get('/')
    list(@Query('search') search?: string) {
        return this.usersService.findAll(search);
    }

    @Get('/:id')
    getUser(@Param('id', new ZodValidationPipe(IdSchema)) id: number) {
        return this.usersService.findOne(id);
    }

    @Post('/')
    @UsePipes(new ZodValidationPipe(CreateUserDto))
    createUser(@Body() user: User) {
        return this.usersService.create(user);
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: number) {
        return this.usersService.delete(id);
    }
}
