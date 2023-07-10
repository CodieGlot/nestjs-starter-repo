import { ApiProperty } from '@nestjs/swagger';
import { AuthTokenPayloadDto } from './auth-token-payload.dto';
import { User } from '../../../users/entities';

export class LoginPayloadDto {
    @ApiProperty()
    authToken: AuthTokenPayloadDto;

    @ApiProperty()
    user: User;

    constructor(dto: LoginPayloadDto) {
        Object.assign(this, dto);
    }
}
