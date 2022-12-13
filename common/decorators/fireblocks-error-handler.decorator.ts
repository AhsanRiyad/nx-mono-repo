import { applyDecorators, ArgumentsHost, ExceptionFilter, HttpException, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { AxiosError } from 'axios';

export class FireblocksErrorFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception?.isAxiosError) {
            const err = exception as AxiosError;
            return response.status(400).json(err.response.data);
        }
        else if (exception instanceof HttpException) {
            return response.status(exception.getStatus()).json(exception.getResponse());
        }
        return response.status(500).json({ success: false, message: "Internal Error" })
    }
}

export function FireblocksErrorHandler() {
    return applyDecorators(
        UseFilters(FireblocksErrorFilter)
    )
}