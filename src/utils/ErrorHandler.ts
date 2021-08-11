import { NextFunction } from "express";

import { HTTPClientError } from "./HttpErrors";
import { logger } from "./logger";
import { Req, Res } from "./types/express";

function clientError(
  err: HTTPClientError,
  _: Req,
  res: Res,
  next: NextFunction,
): void {
  const response = { message: err.message || err };
  if ((err as any).info) {
    Object.assign(response, (err as any).info);
  }

  res.status(err.statusCode).json(response);
  return next();
}

function serverError(
  err: HTTPClientError,
  req: Req,
  res: Res,
  next: NextFunction,
): void {
  const logMessage = err.stack ? `\n ${err.stack}` : ` - ${err}`;
  logger.error(`${new Date()} - ${req.method} - ${req.url} ${logMessage}`);

  res.status(500).json({ message: err.message });
  return next();
}

export function errorHandler(
  err: HTTPClientError,
  req: Req,
  res: Res,
  next: NextFunction,
): void {
  if (!err.statusCode) return serverError(err, req, res, next);

  return clientError(err, req, res, next);
}
