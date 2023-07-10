import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { PageDto, ResponseDto } from '../common/dto';
import { instanceToPlain } from 'class-transformer';

export class WrapResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler) {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        return next.handle().pipe(
            map((res) => {
                if (res instanceof ResponseDto) {
                    return {
                        statusCode,
                        message: res.message
                    };
                }

                if (res instanceof PageDto) {
                    return {
                        statusCode,
                        data: instanceToPlain(res.data),
                        meta: res.meta
                    };
                }

                return {
                    statusCode,
                    data: instanceToPlain(res)
                };
            })
        );
    }
}
