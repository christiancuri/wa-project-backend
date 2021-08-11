import {
  Exam,
  ExamId,
  IExam,
  ILaboratory,
  Laboratory,
  Status,
  Populate,
} from "@models";

import { Doc } from "@types";

import { clone, HTTP400Error } from "@utils";

function sanitizeObject<T>(obj: T, fields = ""): Omit<T, typeof fields> {
  for (const field of fields.split(" ")) delete obj[field];
  return obj;
}

async function getNextId(): Promise<number> {
  const { id } = await ExamId.findOneAndUpdate(
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

export async function createOrActiveExam(
  info: Omit<Doc<IExam>, "_id" | "id" | "status">,
): Promise<Doc<IExam>> {
  const examInfo = sanitizeObject<Omit<Doc<IExam>, "_id" | "id" | "status">>(
    info,
    "_id status id",
  );

  const id = await getNextId();

  const exam = await Exam.findOneAndUpdate(
    { name: new RegExp(`^${info.name}$`, "i") },
    {
      ...examInfo,
      status: Status.ACTIVE,
      id,
    },
    { upsert: true, new: true },
  ).lean();

  return exam;
}

export async function getActiveExams(): Promise<Doc<IExam>[]> {
  return Exam.find({
    status: Status.ACTIVE,
  })
    .sort({ id: 1 })
    .lean();
}

type UpdateExamProp = Omit<
  Doc<IExam>,
  "_id" | "id" | "createdAt" | "updatedAt"
>;

export async function updateExam(
  _id: string,
  info: UpdateExamProp,
): Promise<Doc<IExam>> {
  const examExists = await Exam.exists({ _id });

  if (!examExists) throw new HTTP400Error(`Exam ${_id} not exists`);

  const exam = sanitizeObject<UpdateExamProp>(info, "_id createdAt updatedAt");

  return Exam.findOneAndUpdate({ _id }, clone(exam), { new: true }).lean();
}

export async function disableExams(ids: string[]): Promise<void> {
  await Exam.updateMany(
    {
      _id: {
        $in: ids,
      },
    },
    {
      $set: {
        status: Status.INACTIVE,
      },
    },
  );
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

type ExamWithLaboratoriesPopulated = Doc<IExam> & {
  laboratories: Doc<Populate<ILaboratory, "exams">>;
};

export async function searchLaboratoriesByExamName(
  name: string,
): Promise<ExamWithLaboratoriesPopulated[]> {
  const exams: unknown = await Exam.aggregate<ExamWithLaboratoriesPopulated>([
    {
      $match: {
        name: new RegExp(name, "gi"),
        status: Status.ACTIVE,
      },
    },
    {
      $lookup: {
        from: Laboratory.collection.collectionName,
        let: { examId: "$_id" },
        pipeline: [
          { $match: { $expr: { $in: ["$$examId", "$exams"] } } },
          { $match: { $expr: { $eq: ["$status", Status.ACTIVE] } } },
          {
            $lookup: {
              from: Exam.collection.collectionName,
              localField: "exams",
              foreignField: "_id",
              as: "exams",
            },
          },
        ],
        as: "laboratories",
      },
    },
  ]).sort({ id: 1 });
  return exams as ExamWithLaboratoriesPopulated[];
}
