import express from "express";

import { passthroughErrors } from "@utils";

import * as controller from "./controller";

export const routes = express
  .Router()
  .get("/", passthroughErrors(controller.getLaboratories))
  .post("/", passthroughErrors(controller.createLaboratory))
  .put("/:id", passthroughErrors(controller.updateLaboratory))
  .delete("/", passthroughErrors(controller.deactivateLaboratories));
