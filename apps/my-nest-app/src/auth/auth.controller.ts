import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Ip,
  Patch,
  Post,
  Put,
  Req,
  UseFilters,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { ChangePasswordDto } from "./dto/index.js";
import { RevokeDto } from "./dto/revoke.dto.js";
import { LoginDto } from "./dto/login.dto.js";
import { JwtGuard } from "./guard/index.js";
import { CtAdminJwtGuard } from "./guard/ctAdmin-jwt.guard.js";
import { RefreshJwtGuard } from "./guard/refresh-jwt.guard.js";
import { JwtPayload } from "./interfaces/jwt-payload.interface.js";
import { RefreshToken } from "./interfaces/refresh-token.interface.js";
import { HttpExceptionFilter } from "../modules/logging/filters/exception.filter.js";
import { LoggingInterceptor } from "../modules/logging/interceptors/logging.interceptor.js";
@Controller("auth")
@UseFilters(HttpExceptionFilter)
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  // async login(@Body(ValidationPipe) loginDto: LoginDto) {
  async login(@Req() req, @Body() body: LoginDto, @Ip() ip) {
    req.body.ip = req.headers["x-real-ip"] || ip;
    return await this.authService.signInAsync(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post("sign-out")
  @UseGuards(JwtGuard)
  async revokeToken(
    @Req() req: Request & { user: JwtPayload },
    @Body() body: RevokeDto
  ) {
    if (body.username !== req.user.username) {
      throw new HttpException("Username doesn't match", HttpStatus.CONFLICT);
    }
    return await this.authService.revokeToken(req.user);
  }

  @HttpCode(HttpStatus.OK)
  @Post("refresh-token")
  @UseGuards(RefreshJwtGuard)
  refreshToken(
    @Req()
    req: Request & { user: RefreshToken } & { body: { username: string } }
  ) {
    if (req.body.username !== req.user.username) {
      throw new HttpException("Username doesn't match", HttpStatus.CONFLICT);
    }
    return this.authService.refreshToken(req.user);
  }

  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @Put("reset-password")
  resetPassword(
    @Req() req: Request & { user: JwtPayload } & { body: ChangePasswordDto }
  ) {
    if (req.body.username !== req.user.username) {
      throw new HttpException("Username doesn't match", HttpStatus.CONFLICT);
    }
    return this.authService.resetPassword(req.body, req.user);
  }

  @UseGuards(CtAdminJwtGuard)
  @HttpCode(HttpStatus.OK)
  @Patch("reset-password-admin")
  resetPasswordByAdmin(
    @Req() req: Request & { user: JwtPayload } & { body: ChangePasswordDto }
  ) {
    // if(req.body.username !== req.user.username){
    //     throw new HttpException("Username doesn't match", HttpStatus.CONFLICT)
    // }
    return this.authService.resetPasswordByAdmin(req.body, req.user);
  }
}
