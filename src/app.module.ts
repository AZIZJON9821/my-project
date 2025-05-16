import * as path from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './modules';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard, RoleAuthorizationGuard } from './modules/guards';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      logging: false,
      sync: {
        alter: true,
        // force: true
      },
      autoLoadModels: true,

    }),
    UserModule,
    ProductModule,
  ],
  providers: [
    {provide: APP_GUARD,useClass: AuthenticationGuard},
    {provide: APP_GUARD,useClass: RoleAuthorizationGuard},
  ],
})
export class AppModule {}
