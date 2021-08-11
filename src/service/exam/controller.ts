import { Req, Res } from "@types";

import { Validator } from "@utils";

import * as service from "./service";

export async function createExam(req: Req, res: Res): Promise<void> {
  const { name, type } = Validator.validate(req.body, "name type");

  const exam = await service.createOrActiveExam({ name, type });
  res.json(exam);
}

export async function getExams(req: Req, res: Res): Promise<void> {
  const exams = await service.getActiveExams();
  res.json(exams);
}

export async function deactivateExam(req: Req, res: Res): Promise<void> {
  const { id } = req.params;

  const exam = await service.disableExam(id);

  res.json(exam);
}

export async function updateExam(req: Req, res: Res): Promise<void> {
  const { id } = req.params;

  const { name, type, status } = Validator.validate(
    req.body,
    "name type status",
  );

  const exam = await service.updateExam(id, { name, type, status });

  res.json(exam);
}

export async function assignExam(req: Req, res: Res): Promise<void> {
  const { id } = req.params;

  const { laboratory } = Validator.validate(req.body, "laboratory");

  const response = await service.assignExamToLaboratory(id, laboratory);

  res.json(response);
}

export async function unassignExam(req: Req, res: Res): Promise<void> {
  const { id } = req.params;

  const { laboratory } = Validator.validate(req.body, "laboratory");

  const response = await service.unassignExamFromLaboratory(id, laboratory);

  res.json(response);
}
