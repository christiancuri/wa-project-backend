import express from "express";

import { routes } from "./routes";

export const moduleBaseRoutes = express.Router().use("/module_prefix", routes);
