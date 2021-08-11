/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Types } from "mongoose";

export const id = {
  type: "ObjectId",
  auto: true,
  get: String,
  set: (v) => v,
};

const parseObjectIdToString = (v: any) =>
  Types.ObjectId.isValid(v) ? String(v) : v;
const parseStringToObjectId = (v: any) =>
  Types.ObjectId.isValid(v) ? v : Types.ObjectId(v);

export const refOpts = {
  type: "ObjectId",
  get: (val: Types.ObjectId | Types.ObjectId[]): string | string[] =>
    Array.isArray(val)
      ? val.map(parseObjectIdToString)
      : parseObjectIdToString(val),
  set: (val: string | string[]): Types.ObjectId | Types.ObjectId[] =>
    Array.isArray(val)
      ? val.map(parseStringToObjectId)
      : parseStringToObjectId(val),
};

export const schemaOptions = {
  timestamps: true,
  minimize: false,
  versionKey: false,
};
