import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CtAdminJwtGuard extends AuthGuard('ctAdmin-jwt') {}
