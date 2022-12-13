import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service.js';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    //constructor(private readonly authService : AuthService) {}

    use(req: Request, res: Response, next: NextFunction) {
        next();
    }
}
