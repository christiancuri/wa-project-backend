import { Req, Res } from "@types";

import { Validator } from "@utils";

import * as service from "./service";

type R = Promise<void>;

export async function getLaboratories(_: Req, res: Res): R {
  const labs = await service.getLaboratories();
  res.json(labs);
}

export async function createLaboratory(req: Req, res: Res): R {
  const { name, address, exams } = Validator.validate(
    req.body,
    "name address exams",
  );

  const lab = await service.createLaboratory({ name, address, exams });

  res.json(lab);
}

export async function updateLaboratory(req: Req, res: Res): R {
  const { id } = req.params;
  const { name, address, exams } = Validator.validate(
    req.body,
    "name address exams",
  );

  const { status } = req.body;

  const lab = await service.updateLaboratory(id, {
    name,
    address,
    exams,
    status,
  });

  res.json(lab);
}

export async function deactivateLaboratories(req: Req, res: Res): R {
  const { ids } = Validator.validate(req.query, "ids");

  await service.disableLaboratories(ids.split(","));

  res.sendStatus(204);
}
