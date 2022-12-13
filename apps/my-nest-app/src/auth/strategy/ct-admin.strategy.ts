import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RefreshToken } from '../interfaces/refresh-token.interface.js';

import { JwtService } from "@nestjs/jwt";
import { ApiUserService } from '../../modules/api-user/services/api-user.service.js';
import { LookupService } from '../../modules/lookup/services/lookup.service.js';

@Injectable()
export class CtAdminJwtStrategy extends PassportStrategy(
  Strategy,
  'ctAdmin-jwt',
) {
  constructor(
    config: ConfigService,
    private readonly apiUserService: ApiUserService,
    private readonly lookupService: LookupService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (request, jwtToken, done) => {

        const decodedToken: any = (new JwtService()).decode(jwtToken);
        const user = await this.apiUserService.getUserByUserNameAsync(decodedToken?.username);

        //TODO check it again
        const type = await this.lookupService.getUserByEntityAndValue("api_users", 'Admin')

        // if(!type) done(null, null);

        // done(null, user.remember_token);
        // return;

        if (user?.type_lookup_id == type?.id) {
          done(null, user.remember_token);
        } else {
          done(null, null);
        }
      },
    });
  }

  async validate(payload: RefreshToken) {
    return { ...payload };
  }
}
