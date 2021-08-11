import express from "express";

import { routes } from "./routes";

export const examRoutes = express.Router().use("/exam", routes);
