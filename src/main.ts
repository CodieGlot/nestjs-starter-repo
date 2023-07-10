import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedModule } from './shared/shared.module';

import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './shared/services/api-config.service';
import { WrapResponseInterceptor } from './interceptors';
import { HttpExceptionFilter } from './filters';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    app.setGlobalPrefix('api');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true
            }
        })
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    app.useGlobalInterceptors(new WrapResponseInterceptor());

    const configService = app.select(SharedModule).get(ApiConfigService);

    if (configService.documentationEnabled) {
        setupSwagger(app);
    }

    const port = configService.serverConfig.port;

    await app.listen(port);

    console.info(`🚀 Server running on: http://localhost:${port}/docs`);
}

bootstrap();
