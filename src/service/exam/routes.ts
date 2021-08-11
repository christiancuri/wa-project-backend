import express from "express";

import { passthroughErrors } from "@utils";

import * as controller from "./controller";

export const routes = express
  .Router()
  .get("/", passthroughErrors(controller.getExams))
  .post("/", passthroughErrors(controller.createExam))
  .put("/:id", passthroughErrors(controller.updateExam))
  .delete("/:id", passthroughErrors(controller.deactivateExam))
  .patch("/assign/:id", passthroughErrors(controller.assignExam))
  .patch("/unassign/:id", passthroughErrors(controller.unassignExam));
