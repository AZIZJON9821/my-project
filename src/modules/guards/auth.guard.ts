import {BadRequestException,CanActivate,ConflictException,ExecutionContext,ForbiddenException,Injectable,InternalServerErrorException,} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService, JsonWebTokenError, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PROTECTED_KEY } from 'src/modules/decorator';
import { UserRoles } from 'src/modules/user/enums';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private reflectorService: Reflector,
    private tokenService: JwtService,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isSecured = this.reflectorService.getAllAndOverride<boolean>(
      PROTECTED_KEY,
      [context.getHandler(), context.getClass()],
    );
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<
      Request & { userRole?: UserRoles; userIdentifier?: string }
    >();

    if (!isSecured) {
      request.userRole = UserRoles.USER;
      return true;
    }
    const authHeader = request.headers['authorization'];
    console.log('Auth Header:', authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException('token bilan yuboring');
    }
    const tokenValue = authHeader.replace('Bearer ', '').trim();
    if (!tokenValue) {
      throw new BadRequestException('tokeni kiritish shart');
    }
    try {
      const decodedToken = this.tokenService.verify(tokenValue);
      request.userIdentifier = decodedToken?.id;
      request.userRole = decodedToken?.role;
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('token mudati tugagan');
      }
      if (error instanceof JsonWebTokenError) {
        throw new ConflictException('token notogri');
      }
      throw new InternalServerErrorException('error');
    }
  }
}