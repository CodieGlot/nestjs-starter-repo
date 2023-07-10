import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
    catch(exception: T, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message: object;
        if (typeof exceptionResponse === 'string') {
            message = { message: exceptionResponse };
        } else {
            message = exceptionResponse;
        }

        response.status(status).json({
            ...message,
            timestamp: new Date().toISOString(),
            path: request.url
        });
    }
}
