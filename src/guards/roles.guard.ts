import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../constants';
import { User } from '../modules/users/entities';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());

        if (roles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: User = request.user;

        return roles.includes(user.role);
    }
}
