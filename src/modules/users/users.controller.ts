import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { PageQueryDto } from '../../common/dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getUsers(@Query() pageQueryDto: PageQueryDto) {
        return this.usersService.getUsers(pageQueryDto);
    }
}
