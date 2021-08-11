import { Req, Res } from "@types";

import { Validator } from "@utils";

import * as service from "./service";

type R = Promise<void>;

export async function createExam(req: Req, res: Res): R {
  const { name, type } = Validator.validate(req.body, "name type");

  const exam = await service.createOrActiveExam({ name, type });
  res.json(exam);
}

export async function getExams(req: Req, res: Res): R {
  const exams = await service.getActiveExams();
  res.json(exams);
}

export async function deactivateExams(req: Req, res: Res): R {
  const { ids } = Validator.validate(req.query, "ids");

  await service.disableExams(ids.split(","));

  res.sendStatus(204);
}

export async function updateExam(req: Req, res: Res): R {
  const { id } = req.params;

  const { name, type } = Validator.validate(req.body, "name type");
  const { status } = req.body;

  const exam = await service.updateExam(id, { name, type, status });

  res.json(exam);
}

export async function assignExam(req: Req, res: Res): R {
  const { id } = req.params;

  const { laboratory } = Validator.validate(req.body, "laboratory");

  const response = await service.assignExamToLaboratory(id, laboratory);

  res.json(response);
}

export async function unassignExam(req: Req, res: Res): R {
  const { id } = req.params;

  const { laboratory } = Validator.validate(req.body, "laboratory");

  const response = await service.unassignExamFromLaboratory(id, laboratory);

  res.json(response);
}

export async function searchLaboratoriesByExamName(req: Req, res: Res): R {
  const { name } = Validator.validate(req.query, "name");
  const exams = await service.searchLaboratoriesByExamName(name);
  res.json(exams);
}
