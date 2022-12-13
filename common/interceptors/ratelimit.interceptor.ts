import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { rateLimit } from "utils-decorators";

import * as dotenv from "dotenv";
import { CustomException } from "../exceptions/custom.exception.js";
import { Logger } from "../infrastructure/logger.js";
dotenv.config();

/**
 * Public rate limit interceptor for cumulative request for a public user
 * if you want to bind it to a path then concatenate the path to the return value
 * get the path from route object of request [code] : const { route: { path } } = request;
 * tutorial [doc] : https://vlio20.medium.com/rate-limit-in-nestjs-with-decorators-5b72d502818
 * @export
 * @class PublicRateLimitInterceptor
 * @implements {NestInterceptor}
 */
@Injectable()
export class PublicRateLimitInterceptor implements NestInterceptor {
  @rateLimit({
    /**
     * maximum 20 calls are allowed 
     */
    allowedCalls: 20,
    /**
     * will be rate limited in one minute
     */
    timeSpanMs: 1000 * 60,
    keyResolver: (context: ExecutionContext) => {
      try {
        /**
         * get request
         */
        const request = context.switchToHttp().getRequest();
        /**
         * destructure headers and ip from request
         */
        const { headers, ip } = request;

        /**
         * get the ip if proxy server is used, let's say nginx
         */
        let ip_forwarded: string = null;
        try {
          /**
           * grab the ip
           */
          ip_forwarded = headers["x-real-ip"];
        } catch (error) {
          Logger.error(
            `ClassName: ${PublicRateLimitInterceptor.name} - rateLimit:keyResolver:get_ip_from_header_while_using_proxy_server`,
            "Error",
            error?.message
          );
        }

        /**
         * check if the node_env is production or not
         */
        const is_production =
          process.env.NODE_ENV == "production" ? true : false;
        /**
         * decide about the ip address
         */
        const ip_address = is_production ? ip_forwarded : ip;
        /**
         * return the ip, this will be matched when checking rate limit
         * concatenation is required because we will also make interceptor for authenticated users
         * if you want to bind it to a path then concatenate the path to the return value
         */
        return "public" + ip_address;
      } catch (error) {
        throw new CustomException(
          PublicRateLimitInterceptor.name,
          "rateLimit:keyResolver",
          error
        );
      }
    },
    exceedHandler: () => {
      throw new HttpException(
        "Rate limit exceeded",
        HttpStatus.TOO_MANY_REQUESTS
      );
    },
  })
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> {
    return next.handle();
  }
}
