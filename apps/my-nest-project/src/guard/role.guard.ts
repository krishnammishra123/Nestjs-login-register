 
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('role', context.getHandler());
 
    if (!roles) {
      return true; // Allow access if no roles are specified
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Check if user has at least one of the required roles
      const hasRole = () => roles.includes(user.role);

    return user && hasRole();
  }
}
