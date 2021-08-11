import express from "express";

import * as controller from "./controller";

export const routes = express.Router().post("/login", controller.login);
