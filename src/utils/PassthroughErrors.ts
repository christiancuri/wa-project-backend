import { NextFunction } from "express";

import { Req, Res } from "./types/express";

export const passthroughErrors =
  (fn: (...args: any) => void) =>
  async (req: Req, res: Res, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res);
      next();
    } catch (error) {
      next(error);
    }
  };
