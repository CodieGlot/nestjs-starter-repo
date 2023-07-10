import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthToken } from '../../../constants';
import type { IAuthTokenPayload } from '../../../interfaces/auth-token-payload.interface';
import { ApiConfigService } from '../../../shared/services/api-config.service';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private configService: ApiConfigService, private usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromHeader('refresh-token'),
            secretOrKey: configService.authConfig.publicKey
        });
    }

    async validate(payload: IAuthTokenPayload) {
        if (payload.type !== AuthToken.REFRESH_TOKEN) {
            throw new UnauthorizedException();
        }

        const user = await this.usersService.findUserByIdOrUsername({ id: payload.userId });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
