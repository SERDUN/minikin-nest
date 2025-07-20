import { Controller, Get } from "../../../core";

@Controller('/users')
export class UsersController {
    @Get('/')
    list() {
        return "users list";
    }
}
