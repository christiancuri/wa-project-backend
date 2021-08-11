import express from "express";

import { app, errorHandler } from "@utils";

import { examRoutes } from "./service/exam";
import { laboratoryRoutes } from "./service/laboratory";

export async function router(): Promise<void> {
  const router = express.Router().use(examRoutes).use(laboratoryRoutes);

  app.use(`/api`, router).use(errorHandler);
}
