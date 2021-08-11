import { Exam, IExam, ILaboratory, Laboratory, Status } from "@models";

import { Doc } from "@types";

import { HTTP400Error } from "@utils";

function sanitizeObject<T>(obj: T, fields = ""): Omit<T, typeof fields> {
  for (const field of fields.split(" ")) delete obj[field];
  return obj;
}

export async function createOrActiveExam(
  info: Omit<Doc<IExam>, "_id" | "status">,
): Promise<Doc<IExam>> {
  const examInfo = sanitizeObject<Omit<Doc<IExam>, "_id" | "status">>(
    info,
    "_id status",
  );
  const exam = await Exam.findOneAndUpdate(
    { name: new RegExp(`^${info.name}$`, "i") },
    {
      ...examInfo,
      status: Status.ACTIVE,
    },
    { upsert: true, new: true },
  ).lean();

  return exam;
}

export async function getActiveExams(): Promise<Doc<IExam>[]> {
  return Exam.find({
    status: Status.ACTIVE,
  }).lean();
}

type UpdateExamProp = Omit<Doc<IExam>, "_id" | "createdAt" | "updatedAt">;

export async function updateExam(
  _id: string,
  info: UpdateExamProp,
): Promise<Doc<IExam>> {
  const examExists = await Exam.exists({ _id });

  if (!examExists) throw new HTTP400Error(`Exam ${_id} not exists`);

  const exam = sanitizeObject<UpdateExamProp>(info, "_id createdAt updatedAt");

  return Exam.findOneAndUpdate({ _id }, exam, { new: true }).lean();
}

export async function disableExam(_id: string): Promise<Doc<IExam>> {
  const examExists = await Exam.exists({ _id });

  if (!examExists) throw new HTTP400Error(`Exam ${_id} not exists`);

  return Exam.findOneAndUpdate(
    { _id },
    {
      $set: {
        status: Status.INACTIVE,
      },
    },
    { new: true },
  ).lean();
}

async function validateLaboratoryAndExam(
  examId: string,
  labId: string,
): Promise<void> {
  const [labExists, examExists] = await Promise.all([
    Laboratory.exists({ _id: labId }),
    Exam.exists({ _id: examId }),
  ]);
  if (!labExists) throw new HTTP400Error(`Laboratory ${labId} not exists`);
  if (!examExists) throw new HTTP400Error(`Exam ${examId} not exists`);
}

export async function assignExamToLaboratory(
  examId: string,
  labId: string,
): Promise<Doc<ILaboratory>> {
  await validateLaboratoryAndExam(examId, labId);

  return Laboratory.findOneAndUpdate(
    {
      _id: labId,
    },
    {
      $addToSet: {
        exams: examId,
      },
    },
    {
      new: true,
    },
  ).lean();
}

export async function unassignExamFromLaboratory(
  examId: string,
  labId: string,
): Promise<Doc<ILaboratory>> {
  await validateLaboratoryAndExam(examId, labId);

  return Laboratory.findOneAndUpdate(
    {
      _id: labId,
    },
    {
      $pull: {
        exams: examId,
      },
    },
    {
      new: true,
    },
  ).lean();
}
