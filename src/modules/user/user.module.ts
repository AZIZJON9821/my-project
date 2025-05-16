import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../models';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: 'test-key',
      signOptions: {
        expiresIn:3600,
      },
    }),
  ],
  controllers: [ AuthController],
  providers: [ AuthService],
   exports: [SequelizeModule],
})
export class UserModule {}
