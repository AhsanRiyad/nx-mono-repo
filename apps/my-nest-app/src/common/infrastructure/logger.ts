import * as log4js from 'log4js';
const { getLogger, levels } = log4js;

const DATE_MULTIPLIER = (1000 * 60 * 60 * 24);

export const log4jsConfiguration: log4js.Configuration = {
    appenders: {
        out: { type: "stdout" },
        //console: { type: "console" },
        app: { type: "file", filename: "./logs/" + Math.floor(Date.now() / DATE_MULTIPLIER) + "-carbon-title-web3-error.log" }
    },
    categories: {
        default: { appenders: ["app", "out"], level: "error" },
        file: { appenders: ["app"], level: "DEBUG" },
        console: { appenders: ["out"], level: "ERROR" }
    }
}

export class Logger {
    public static log(origin: string, message: string, ...data: any[]) {
        const logger = getLogger(origin);
        logger.level = levels.DEBUG;
        logger.info(message, ...data);
    }

    public static error(origin: string, message: string, ...data: any[]) {
        const logger = getLogger(origin);
        logger.level = levels.ERROR;
        logger.error(message, ...data);
    }

    public static warning(origin: string, message: string, ...data: any[]) {
        const logger = getLogger(origin);
        logger.level = levels.WARN;
        logger.warn(message, ...data);
    }

    public static file(origin: string, message: string, ...data: any[]) {
        const logger = getLogger("file");
        logger.level = levels.DEBUG;
        logger.debug(message, ...data);
    }

    public static console(message: string, ...data: any[]) {
        const logger = getLogger("console");
        logger.level = levels.ERROR;
        logger.error(message, ...data);
    }

}