import { HttpException, HttpStatus } from "@nestjs/common";
import { Logger } from "../infrastructure/logger.js";

export class HttpExceptionWithLog extends HttpException {
  constructor(message, status, className: string, methodName: string) {

    if(status >= 500) {
      Logger.file(`ClassName: ${className} - ${methodName}`, "Error", message);
    }

    Logger.console(`ClassName: ${className} - ${methodName}`, "Error", message);

    super(message, status);
  }
}
