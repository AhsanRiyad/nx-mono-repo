import { HttpException, Logger } from "@nestjs/common";

export const formatException = (className: string, methodName: string, error: any)=>{
    Logger.error(`ClassName: ${className} - ${methodName}`, "Error", error?.message);
    const status = error?.response?.status ?? error?.status
    const message = error?.response?.message ?? error?.message
    throw new HttpException(message, status);
}