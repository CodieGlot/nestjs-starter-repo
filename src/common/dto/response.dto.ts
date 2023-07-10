import { ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseDto {
    @ApiPropertyOptional({ type: () => Number })
    status?: number;

    @ApiPropertyOptional()
    message: string;

    constructor(dto: ResponseDto) {
        Object.assign(this, dto);
    }
}
