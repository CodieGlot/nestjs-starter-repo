import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenPayloadDto {
    @ApiProperty()
    expiresIn: number;

    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;

    constructor(dto: AuthTokenPayloadDto) {
        Object.assign(this, dto);
    }
}
