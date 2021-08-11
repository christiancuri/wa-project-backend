import getters from "mongoose-lean-getters";

import { schemaOptions, getModel, id } from "@types";

import { prop, modelOptions, plugin } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

export enum ExamType {
  IMAGE = "image",
  CLINICAL_ANALYSIS = "clinical_analysis",
}

enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

@plugin(getters)
@modelOptions({
  options: { customName: "exam" },
  schemaOptions,
})
export class IExam extends TimeStamps {
  @prop(id)
  _id?: String;

  @prop()
  id: number;

  @prop({ required: true })
  name: string;

  @prop({ required: true, enum: ExamType })
  type: ExamType;

  @prop({ enum: Status, default: Status.ACTIVE })
  status: Status;
}

export const Exam = getModel(IExam);
