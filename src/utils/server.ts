import { json } from "body-parser";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import session from "express-session";
import helmet from "helmet";
import morgan from "morgan";

import { logger } from "./logger";

import "express-async-errors";

const app = express();

app
  .use(helmet())
  .use(
    session({
      name: "waproject",
      secret: "alsjdnaksdjnk1j2nk3nwknaskjn1k23",
      resave: true,
      saveUninitialized: true,
    }),
  )
  .use((req, _, next) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    req.getUrl = () => req.protocol + "://" + req.get("host") + req.originalUrl;
    return next();
  })
  .use(
    morgan("combined", {
      stream: {
        write: (info: string) => logger.info(info.trim()),
      },
      skip: (req) => req.method === "OPTIONS",
    }),
  )
  .use(cors())
  .use(fileUpload())
  .use(json({ limit: "20mb" }))
  .set("trust proxy", true)
  .set("x-powered-by", false);

const port = process.env.PORT || 5000;
app.listen(port, () => logger.info(`[Server] Running on port ${port}`));

export default app;
