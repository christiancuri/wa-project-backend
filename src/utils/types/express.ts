import { Request, Response } from "express";

export type UserProps = {
  ip?: string;
  _id: string;
  userId: string;
};

export type Req = Request;
export type Res = Response;

declare module "express" {
  interface Request {
    user?: UserProps;
  }
}
