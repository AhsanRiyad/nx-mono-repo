import { HttpException, HttpStatus } from "@nestjs/common";
import { Logger } from "../infrastructure/logger.js";

export class CustomException extends HttpException {
    constructor(className: string, methodName: string, error: any, customMessage?: string) {
      
      const status = error?.response?.status ?? error?.status;
      const message = error?.response?.message ?? error?.message;
      const modifiedMsg = customMessage ? customMessage : message;

      if(status >= 500){
        Logger.file(`ClassName: ${className} - ${methodName}`, "Error", { errorMsg: error?.message,  customMessage, error });
      }

      Logger.console(`ClassName: ${className} - ${methodName}`, "Error", { modifiedMsg, customMessage });
      
      super(modifiedMsg, status);
    }
}

