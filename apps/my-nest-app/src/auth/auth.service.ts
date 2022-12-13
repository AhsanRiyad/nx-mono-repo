import JwtConfig from "../config/jwt.config.js";
import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ApiUserService } from "../modules/api-user/services/api-user.service.js";
import { ApiUserValidationRequestDto } from "../modules/api-user/dto/api-user-validation-request.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { JwtPayload } from "./interfaces/jwt-payload.interface.js";
import * as argon2 from "argon2";
import { dbErrorCodes } from "../common/constants/db-error-codes.js";
import { RefreshToken } from "./interfaces/refresh-token.interface.js";
import { v4 as uuid } from 'uuid';
import { ChangePasswordDto } from "./dto/index.js";
import { ChangePasswordByAdminDto } from "./dto/change-password-by-admin.dto.js";
import { Logger } from "../common/infrastructure/logger.js";
import { LookupService } from "../modules/lookup/services/lookup.service.js";

@Injectable({})
export class AuthService {
    constructor(
        private apiUserService: ApiUserService,
        private lookupService: LookupService,
        private jwt: JwtService
    ) { }

    async resetPassword(dto: ChangePasswordDto, user: JwtPayload) {
        return this.apiUserService.updatePassword(dto, user)
    }

    async resetPasswordByAdmin(dto: ChangePasswordByAdminDto, user: JwtPayload) {
        return this.apiUserService.updatePasswordByAdmin(dto, user)
    }

    async revokeToken(user) {
        const result = await this.apiUserService.removeRememberToken(user.username)
        if (result) {
            return {
                success: true,
                message: "",
                data: {}
            }
        } else {
            throw new HttpException('Server Problem', HttpStatus.CONFLICT)
        }
    }

    async signInAsync(loginDto: LoginDto) {
        // Logger.log("insider auth service", "Hitted", "value");
        const user = await this.apiUserService.getUserByUserNameAsync(loginDto.username);
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        if (user.is_active == false){
            throw new HttpException('This user has been deleted.', HttpStatus.NOT_FOUND);
        }

        const type = await this.lookupService.getByIdAsync(user.type_lookup_id)


        const data = { ...user, type: type.value }

        await this.validateUserAsync(data, loginDto.password);

        // this.loginDetailsService.createOne({ username: user.username, last_ip_address: loginDto.ip })

        return await this.signTokenAsync({
            id: user.id,
            email: user.email,
            username: user.username,
            type: user?.type_lookup?.value,
            roles: []
        }, user)
        //return user;
    }

    async refreshToken(dto: RefreshToken) {
        const user = await this.apiUserService.getUserByUserNameAsync(dto.username);

        if (!user) throw new ForbiddenException();

        return await this.signTokenAsync({
            id: user.id,
            email: user.email,
            username: user.username,
            type: user?.type_lookup?.value,
            roles: []
        }, user)

    }

    async signTokenAsync(payload: JwtPayload, user: any) {

        const expires_in = '30d';

        const remember_token: string | boolean = await this.apiUserService.updateRememberToken(user.username)


        if (typeof remember_token == 'boolean') return;

        // const refreshPayload = {
        //     username: payload.username,
        // };

        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: expires_in,
            secret: remember_token
        });


        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: JwtConfig.TIMEOUT,
            secret: remember_token
        });

        return {
            success: true,
            message: "",
            data: {
                accessToken,
                refreshToken,
                accessToken_expires_in: JwtConfig.TIMEOUT,
                refresh_token_expires_in: expires_in
            }
        };
    }

    async validateUserAsync(user: ApiUserValidationRequestDto, password: string) {
        const passwordMatches = await argon2.verify(user.password, password);

        if (!passwordMatches)
            throw new UnauthorizedException(
                'Incorrect Credentials',
            )
        return true;
    }
}