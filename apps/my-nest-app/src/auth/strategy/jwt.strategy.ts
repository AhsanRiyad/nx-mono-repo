import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'auth/interfaces/jwt-payload.interface.js';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { JwtService } from "@nestjs/jwt";
import { ApiUserService } from '../../modules/api-user/services/api-user.service.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly apiUserService: ApiUserService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // secretOrKey: config.get('JWT_SECRET'),
      secretOrKeyProvider: async (request, jwtToken, done) => {
        try {
          const decodedToken: any = (new JwtService()).decode(jwtToken);
          const user = await this.apiUserService.getUserByUserNameAsync(decodedToken?.username);

          done(null, user?.remember_token);
        } catch (error) {
          done(null, null);
        }
      },
    });
  }

  async validate(payload: JwtPayload) {
    return { ...payload }
  }
}