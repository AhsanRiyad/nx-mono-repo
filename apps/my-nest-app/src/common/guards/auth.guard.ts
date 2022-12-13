import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";

export type UserRole = "web2"

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(
    context: ExecutionContext,
    ): boolean | Promise<boolean> {
        const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
        if (!roles || roles.length <= 0)
            return true;
        const request = context.switchToHttp().getRequest<Request>();
        const ip = request.ip;

        return false;
  }
}