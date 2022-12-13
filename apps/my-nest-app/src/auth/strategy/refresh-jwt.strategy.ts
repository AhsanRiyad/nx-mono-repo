import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshToken } from '../interfaces/refresh-token.interface.js';

import { JwtService } from "@nestjs/jwt";
import { ApiUserService } from '../../modules/api-user/services/api-user.service.js';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt',
) {
  constructor(
    config: ConfigService,
    private readonly apiUserService: ApiUserService
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (request, jwtToken, done) => {
        const decodedToken: any = (new JwtService()).decode(jwtToken);
        const user = await this.apiUserService.getUserByUserNameAsync(decodedToken?.username);
        done(null, user?.remember_token);
      },
    });
  }

  async validate(payload: RefreshToken) {
    return { ...payload };
  }
}
