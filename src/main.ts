import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

async function bootstrap() {
	const logger = new Logger('Swagger');
	const app = await NestFactory.create(AppModule);

	app.setGlobalPrefix('api');

	app.enableCors();

	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			transform: true,
			transformOptions: {
				enableImplicitConversion: true,
			},
		}),
	);

	const config = new DocumentBuilder()
		.setTitle(process.env.APP_NAME)
		.setDescription(process.env.APP_NAME)
		.setVersion('1.0')
		.addBearerAuth(
			{
				description: 'Por favor introduce el JWT.',
				name: 'Authorization',
				bearerFormat: 'Bearer',
				scheme: 'Bearer',
				type: 'http',
				in: 'Header',
			},
			'access-token',
		)
		.build();

	const document = SwaggerModule.createDocument(app, config);

	const endpointsCount = Object.keys(document.paths).length;
	SwaggerModule.setup('docs', app, document, {
		swaggerOptions: {
			docExpansion: 'none',
		},
	});

	await app.listen(process.env.APP_PORT || 3000);
	logger.log(`Total endpoints: ${endpointsCount}`);
}

bootstrap();
