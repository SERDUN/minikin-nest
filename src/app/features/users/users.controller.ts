import {
    Controller,
    Get,
    Post,
    Delete,
    UseFilter,
    Body,
    Param,
    Query,
    UsePipes,
    UseGuards,
    RolesGuard, Roles, UseInterceptor
} from "../../../core";
import { UsersService } from "./users.service";
import { ZodValidationPipe } from "../../piepes";
import { NotFoundFilter } from "../../filters";
import { CreateUserDto, IdSchema, User } from "./schemes";
import { LoggingInterceptor } from "../../interceptors";

@UseGuards(RolesGuard)
@Controller('/users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @UseInterceptor(LoggingInterceptor)
    @Get('/')
    list(@Query('search') search?: string) {
        return this.usersService.findAll(search);
    }

    @UseFilter(new NotFoundFilter())
    @Get('/:id')
    getUser(@Param('id', new ZodValidationPipe(IdSchema)) id: number) {
        return this.usersService.findOne(id);
    }

    @Roles('admin')
    @Post('/')
    @UsePipes(new ZodValidationPipe(CreateUserDto))
    createUser(@Body() user: User) {
        return this.usersService.create(user);
    }

    @Delete('/:id')
    deleteUser(@Param('id') id: number) {
        return this.usersService.delete(id);
    }

    @Get('/crash')
    getInternalError() {
        throw new Error('Bingo!');
    }
}
