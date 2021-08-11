import getters from "mongoose-lean-getters";

import { schemaOptions, getModel, id } from "@types";

import { prop, modelOptions, plugin } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

const isValidEmail = (v: string): boolean =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    v,
  );

@plugin(getters)
@modelOptions({
  options: { customName: "user" },
  schemaOptions,
})
export class IUser extends TimeStamps {
  @prop(id)
  _id?: String;

  @prop({
    required: true,
    unique: true,
    select: false,
    maxlength: 64,
    validate: { validator: isValidEmail, message: "Invalid email" },
  })
  email: string;

  @prop({ required: true, maxlength: 64 })
  name: string;

  @prop({ required: true, select: false })
  hash: string;

  @prop({ default: "" })
  picture?: string;
}

export const User = getModel(IUser);
