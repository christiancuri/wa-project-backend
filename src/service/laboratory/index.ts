import express from "express";

import { routes } from "./routes";

export const laboratoryRoutes = express.Router().use("/laboratory", routes);
