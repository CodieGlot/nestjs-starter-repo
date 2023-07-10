import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserRole } from '../constants';
import { JwtAuthGuard, JwtRefreshGuard, RolesGuard } from '../guards';

export function Auth(roles: UserRole[] = []) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(JwtAuthGuard, RolesGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Unauthorized' })
    );
}

export function RefreshToken() {
    return applyDecorators(
        UseGuards(JwtRefreshGuard),
        ApiUnauthorizedResponse({ description: 'Unauthorized' })
    );
}
