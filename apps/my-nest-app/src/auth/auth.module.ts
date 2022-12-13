import { JwtStrategy } from './strategy/jwt.strategy.js';
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { ApiUserModule } from "../modules/api-user/api-user.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { ApiUserService } from '../modules/api-user/services/api-user.service.js';
import { RefreshJwtStrategy } from './strategy/refresh-jwt.strategy.js';
import { CtAdminJwtStrategy } from './strategy/ct-admin.strategy.js';
import { LookupModule } from '../modules/lookup/lookup.module.js';
import { LoggingModule } from '../modules/logging/logging.module.js';

@Module({
    imports: [
        JwtModule.register({}),
        PassportModule,
        ApiUserModule,
        LookupModule,
        LoggingModule
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RefreshJwtStrategy, CtAdminJwtStrategy]
})
export class AuthModule { }