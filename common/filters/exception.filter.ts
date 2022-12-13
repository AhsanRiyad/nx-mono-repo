
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

interface HttpExceptionResponse {
  statusCode: number;
  message: any;
  error: string;
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let message = "Unknown error"

    if(exception instanceof HttpException) {
      const errorResponse = exception.getResponse();
      message = (errorResponse as HttpExceptionResponse).message || exception.message;
    } 

    response
      .status(status)
      .json({
        statusCode: status,
        // timestamp: new Date().toISOString(),
        message
        // path: request.url,
      });
    // response.send(exception)
  }
}