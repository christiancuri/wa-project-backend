/* eslint-disable @typescript-eslint/no-var-requires */
import * as MongoDB from "./utils/MongoDB";

(async function () {
  await MongoDB.connect(process.pid.toString());

  const { router } = require("./router");
  router();
})();
