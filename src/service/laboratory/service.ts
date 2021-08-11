import {
  Doc,
  ILaboratory,
  Laboratory,
  LaboratoryId,
  Populate,
  Status,
} from "@models";

import { HTTP400Error } from "@utils";

function sanitizeObject<T>(obj: T, fields = ""): Omit<T, typeof fields> {
  for (const field of fields.split(" ")) delete obj[field];
  return obj;
}

async function getNextId(): Promise<number> {
  const { id } = await LaboratoryId.findOneAndUpdate(
    {},
    {
      $inc: {
        id: 1,
      },
    },
    { upsert: true, new: true },
  ).lean();

  return id;
}

export async function getLaboratories(): Promise<
  Doc<Populate<ILaboratory, "exams">>[]
> {
  return Laboratory.find({
    status: Status.ACTIVE,
  })
    .populateTs(["exams"])
    .lean();
}

export async function createLaboratory(
  info: Omit<Doc<ILaboratory>, "_id" | "id" | "status">,
): Promise<Doc<ILaboratory>> {
  const laboratoryInfo = sanitizeObject<
    Omit<Doc<ILaboratory>, "_id" | "status" | "id">
  >(info, "_id status id");

  const id = await getNextId();

  const laboratory = await Laboratory.findOneAndUpdate(
    {
      name: new RegExp(`^${info.name}`, "i"),
    },
    {
      ...laboratoryInfo,
      status: Status.ACTIVE,
      id,
    },
    {
      new: true,
      upsert: true,
    },
  ).lean();

  return laboratory;
}

type UpdateLabProp = Omit<
  Doc<ILaboratory>,
  "_id" | "id" | "createdAt" | "updatedAt"
>;

export async function updateLaboratory(
  _id: string,
  info: UpdateLabProp,
): Promise<Doc<ILaboratory>> {
  const labExists = await Laboratory.exists({ _id });

  if (!labExists) throw new HTTP400Error(`Laboratory ${_id} not exists`);

  const laboratory = sanitizeObject<UpdateLabProp>(
    info,
    "_id createdAt updatedAt",
  );

  return Laboratory.findOneAndUpdate({ _id }, laboratory, { new: true }).lean();
}

export async function disableLaboratory(
  _id: string,
): Promise<Doc<ILaboratory>> {
  const labExists = await Laboratory.exists({ _id });

  if (!labExists) throw new HTTP400Error(`Laboratory ${_id} not exists`);

  return Laboratory.findOneAndUpdate(
    { _id },
    {
      $set: {
        status: Status.INACTIVE,
      },
    },
    { new: true },
  ).lean();
}
