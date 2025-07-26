var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Post, Delete, UseFilter, Body, Param, Query, UsePipes, UseGuards, RolesGuard, Roles } from "../../../core";
import { UsersService } from "./users.service";
import { ZodValidationPipe } from "../../piepes";
import { NotFoundFilter } from "../../filters";
import { CreateUserDto, IdSchema } from "./schemes";
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    list(search) {
        return this.usersService.findAll(search);
    }
    getUser(id) {
        return this.usersService.findOne(id);
    }
    createUser(user) {
        return this.usersService.create(user);
    }
    deleteUser(id) {
        return this.usersService.delete(id);
    }
};
__decorate([
    Get('/'),
    __param(0, Query('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "list", null);
__decorate([
    UseFilter(new NotFoundFilter()),
    Get('/:id'),
    __param(0, Param('id', new ZodValidationPipe(IdSchema))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUser", null);
__decorate([
    Roles('admin'),
    Post('/'),
    UsePipes(new ZodValidationPipe(CreateUserDto)),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "createUser", null);
__decorate([
    Delete('/:id'),
    __param(0, Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteUser", null);
UsersController = __decorate([
    UseGuards(RolesGuard),
    Controller('/users'),
    __metadata("design:paramtypes", [UsersService])
], UsersController);
export { UsersController };
