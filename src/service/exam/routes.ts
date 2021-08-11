import express from "express";

import { passthroughErrors } from "@utils";

import * as controller from "./controller";

export const routes = express
  .Router()
  .get("/", passthroughErrors(controller.getExams))
  .post("/", passthroughErrors(controller.createExam))
  .put("/:id", passthroughErrors(controller.updateExam))
  .delete("/", passthroughErrors(controller.deactivateExams))
  .put("/assign/:id", passthroughErrors(controller.assignExam))
  .put("/unassign/:id", passthroughErrors(controller.unassignExam));
