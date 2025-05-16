import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { NotAcceptableException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env?.NODE_ENV?.trim() === 'development') {
    app.use(morgan('tiny'));
  }
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }),
  );
  const config = new DocumentBuilder()
  .setTitle('Small Shop API')
  .setDescription('The Small Shop API description')
  .setVersion('1.0')
  .addBearerAuth()
  // .addCookieAuth("accesstoken")
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  app.enableCors({
    allowedHeaders: ['authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    origin: (reqOrigin, cb) => {
      const allowedOrigins = process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(',')
        : ['*'];
      if (allowedOrigins.includes(reqOrigin) || allowedOrigins.includes('*')) {
        return cb(null, reqOrigin);
      } else
        cb(
          new NotAcceptableException(
            `${reqOrigin}'ruhsat yo'q`,
          ),
        );
    },
  });

  const port = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3000;
  await app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
}
bootstrap();
