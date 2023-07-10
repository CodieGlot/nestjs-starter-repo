import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import type { UserCredentialDto } from './dto/request';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { AuthToken, UserRole } from '../../constants';
import { UserNotFoundException } from '../../exceptions';
import { AuthTokenPayloadDto, LoginPayloadDto } from './dto/response';
import { validateHash } from '../../common/utils';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ApiConfigService
    ) {}

    async createAuthToken(data: { userId: string; role: UserRole }) {
        return new AuthTokenPayloadDto({
            expiresIn: this.configService.authConfig.jwtExpirationTime,
            accessToken: await this.jwtService.signAsync({
                userId: data.userId,
                role: data.role,
                type: AuthToken.ACCESS_TOKEN
            }),
            refreshToken: await this.jwtService.signAsync(
                {
                    userId: data.userId,
                    role: data.role,
                    type: AuthToken.REFRESH_TOKEN
                },
                {
                    expiresIn: this.configService.authConfig.jwtRefreshExpirationTime
                }
            )
        });
    }

    async login(dto: UserCredentialDto) {
        const user = await this.validateUserCredential(dto);

        const authToken = await this.createAuthToken({ userId: user.id, role: user.role });

        return new LoginPayloadDto({
            user,
            authToken
        });
    }

    async signup(dto: UserCredentialDto) {
        const user = await this.usersService.createUser(dto);

        const authToken = await this.createAuthToken({ userId: user.id, role: user.role });

        return new LoginPayloadDto({
            user,
            authToken
        });
    }

    async validateUserCredential(dto: UserCredentialDto) {
        const user = await this.usersService.findUserByIdOrUsername({ username: dto.username });

        if (!user) {
            throw new UserNotFoundException();
        }

        const isPasswordMatched = await validateHash(dto.password, user.password);

        if (!isPasswordMatched) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
