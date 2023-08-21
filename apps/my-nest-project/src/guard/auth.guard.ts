import {CanActivate,ExecutionContext,Injectable,UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Unauthorized: No token provided');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      if (!payload) {
        throw new UnauthorizedException('Unauthorized: User not found');
      }
      request.user = payload;
      request.email = payload.email;
      request.role = payload.role;
      request.userid = payload.id;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized: Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

