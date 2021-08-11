import express from "express";

import { app, errorHandler } from "@utils";

import { examRoutes } from "./service/exam";

export async function router(): Promise<void> {
  const router = express.Router().use(examRoutes);

  app.use(`/api`, router).use(errorHandler);
}
