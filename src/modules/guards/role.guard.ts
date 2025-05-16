import {CanActivate,ExecutionContext,ForbiddenException,Injectable,} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/modules/decorator';
import { UserRoles } from 'src/modules/user/enums';

@Injectable()
export class RoleAuthorizationGuard implements CanActivate {
  constructor(private metadataReflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<
      Request & { userRole?: UserRoles; userIdentifier?: string }
    >();
    const allowedRoles = this.metadataReflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!allowedRoles || allowedRoles.length === 0) {
      return true;
    }
    const currentUserRole = req.userRole;
    if (!currentUserRole || !allowedRoles.includes(currentUserRole)) {
      throw new ForbiddenException('admin emasiz');
    }
    return true;
  }
}
