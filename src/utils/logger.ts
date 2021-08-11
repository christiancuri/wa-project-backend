import winston, { format } from "winston";
import "colors";

const { combine } = format;

const winstonConfig = {
  level: "info",
  handleExceptions: true,
  format: combine(winston.format.colorize(), winston.format.simple()),
};

const transports = [new winston.transports.Console(winstonConfig)];

export const logger = winston.createLogger({
  transports,
  exitOnError: false,
});
