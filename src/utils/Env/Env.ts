import fs from "fs";
import path from "path";

import { IEnv } from "./typings";

export const Env = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../../env.json"), "utf-8"),
) as IEnv;
