import getters from "mongoose-lean-getters";

import { schemaOptions, getModel, id, Reference, refOpts } from "@types";

import { prop, modelOptions, plugin } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

import { IExam } from "../Exam";

enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@plugin(getters)
@modelOptions({
  options: { customName: "laboratory" },
  schemaOptions,
})
export class ILaboratory extends TimeStamps {
  @prop(id)
  _id?: String;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  address: string;

  @prop({ enum: Status, default: Status.ACTIVE })
  status: Status;

  @prop({ ref: () => IExam, ...refOpts, default: [] })
  exams: Reference<IExam>[];
}

export const Laboratory = getModel(ILaboratory);
