import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { rateLimit } from 'utils-decorators';
import { map, tap } from 'rxjs/operators';


// https://vlio20.medium.com/rate-limit-in-nestjs-with-decorators-5b72d502818
@Injectable()
export class LoggingInterceptor implements NestInterceptor {

 intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {

   const now = Date.now(); 

   const value = context.switchToHttp().getRequest()

   // console.log("value printing " , value)

//    return next
//       .handle()
//       .pipe(
//         tap(() => {
//          console.log(`After... ${Date.now() - now}ms`)
//          const response = context.switchToHttp().getResponse()
//          console.log(response)
//          response.end()
//         }),
//       );
//   }

//    return next
//       .handle()
//       .pipe(
//         tap((value) => {
//          console.log(value)
//          console.log(`After... ${Date.now() - now}ms`)
//          const response = context.switchToHttp().getResponse()
//          // console.log(response)
//          response.end()
//         }),
//       );
//   }

         return next
         .handle()
         .pipe(map(value => {
            // console.log(`After... ${Date.now() - now}ms`)
            // console.log(value)
            return value
         }));
         }

}