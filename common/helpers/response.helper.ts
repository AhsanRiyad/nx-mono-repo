import { iResponse } from "../interfaces/response.interface.js";

export class ResponseHelperCommon {

    private static instance: ResponseHelperCommon;

    public static getInstance(): ResponseHelperCommon {
        if (!ResponseHelperCommon.instance) {
            ResponseHelperCommon.instance = new ResponseHelperCommon();
        }
        return ResponseHelperCommon.instance;
    }

    public getModifiedResponse({ success = true, message = "" , data = {} }, type?: string) : iResponse {
        data = this.getTransformedValue(data, type);

        return {
            success,
            message,
            data
        }
    }

    public getTransformedValue(data: any, type?: string){
        return data;
    }

}

export const getModifiedResponse = ResponseHelperCommon.getInstance().getModifiedResponse;