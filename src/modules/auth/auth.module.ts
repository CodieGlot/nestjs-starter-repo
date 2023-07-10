import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy, JwtStrategy } from './strategies';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            useFactory: (configService: ApiConfigService) => ({
                privateKey: configService.authConfig.privateKey,
                publicKey: configService.authConfig.publicKey,
                signOptions: {
                    algorithm: 'RS256',
                    expiresIn: configService.authConfig.jwtExpirationTime
                },
                verifyOptions: {
                    algorithms: ['RS256']
                }
            }),
            inject: [ApiConfigService]
        }),
        UsersModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, JwtRefreshStrategy]
})
export class AuthModule {}
