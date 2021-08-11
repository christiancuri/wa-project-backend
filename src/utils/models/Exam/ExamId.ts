import getters from "mongoose-lean-getters";

import { schemaOptions, getModel, id } from "@types";

import { prop, modelOptions, plugin } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";

@plugin(getters)
@modelOptions({
  options: { customName: "examId" },
  schemaOptions,
})
export class IExamId extends TimeStamps {
  @prop(id)
  _id?: String;

  @prop({ default: 0 })
  id: number;
}

export const ExamId = getModel(IExamId);
