import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthenticateNotifierMiddleware implements NestMiddleware{
    use(req: Request, res: Response, next: NextFunction) {
        
        const key = req.header('notifier-key')
        
        if(process.env.NOTIFIER_KEY === key){
            next();
        } else {
            throw new BadRequestException();
        }

    }
}