import { createLogger, format, transports } from "winston";
import { v4 as uuid } from "uuid"

const customConsoleFormat = format.printf(({ message, timestamp }) => {
    return `${timestamp}: ${message}`;
});
const timestampFormat = "dd-MM-YY HH:mm:ss";

const logsPath = "./logs";

const timeString = new Date().toLocaleTimeString('en-US', {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
});
const dateString = new Date().toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
}).replace(/\//g, '-');

export const logger = createLogger({
    format: format.combine(format.timestamp({ format: timestampFormat }), format.json()),
    transports: [
        new transports.Console({
            format: format.combine(format.timestamp({ format: timestampFormat }), customConsoleFormat),
        }),
        new transports.File({
            filename: `${logsPath}/${dateString}/${timeString}-${uuid().substring(24, 37)}.log`,
        }),
    ],
});
