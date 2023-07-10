import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserCredentialDto } from './dto/request';
import { AuthTokenPayloadDto, LoginPayloadDto } from './dto/response';
import { Auth, AuthUser, RefreshToken } from '../../decorators';
import type { User } from '../users/entities';
import { UserRole } from '../../constants';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'User info with access token',
        type: LoginPayloadDto
    })
    @ApiOperation({ summary: 'Login with username and password' })
    login(@Body() userCredentialDto: UserCredentialDto) {
        return this.authService.login(userCredentialDto);
    }

    @Post('signup')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Sign up successfully',
        type: LoginPayloadDto
    })
    @ApiOperation({ summary: 'Sign up with username and password' })
    signup(@Body() userCredentialDto: UserCredentialDto) {
        return this.authService.signup(userCredentialDto);
    }

    @Get('me')
    @HttpCode(HttpStatus.OK)
    @Auth([UserRole.ADMIN, UserRole.USER])
    @ApiOkResponse({
        description: 'Get current user',
        type: LoginPayloadDto
    })
    @ApiOperation({ summary: 'Get current user info' })
    getCurrentUser(@AuthUser() user: User) {
        return user;
    }

    @Post('refresh-token')
    @RefreshToken()
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({
        description: 'Get new auth token successfully',
        type: AuthTokenPayloadDto
    })
    @ApiOperation({ summary: 'Get new auth token' })
    getNewAuthToken(@AuthUser() user: User) {
        return this.authService.createAuthToken({ userId: user.id, role: user.role });
    }
}
