import fs from "fs";
import mongoose from "mongoose";
import path from "path";

import { Env } from "./Env";
import { logger } from "./logger";

const credentials = fs.readFileSync(
  path.join(__dirname, "../../keys/database/mongodb.pem"),
);

function getUri(): string {
  const { user, password, uri, dbname, options } = Env.database;

  const host = user && password ? `${user}:${password}@${uri}` : uri;

  return `mongodb+srv://${host}/${dbname}?${options}`;
}

function getOptions(): mongoose.ConnectionOptions {
  let options: mongoose.ConnectionOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
  };

  if (credentials.toString()) {
    options = {
      ...options,
      sslKey: credentials,
      sslCert: credentials,
    };
  }
  return options;
}

export async function connect(pid = process.pid.toString()): Promise<void> {
  let resolve: () => void;
  const promise = new Promise((r: (...args: any) => void) => (resolve = r));

  const { dbname, uri: host } = Env.database;
  const uri = getUri();
  const options = getOptions();
  mongoose.connect(uri, options);
  logger.info("[MongoDB] Starting connection");
  mongoose.connection.on("connected", () => {
    logger.info(`[MongoDB] Connected ${dbname}@${host} on PID ${pid}`);
    resolve();
  });
  mongoose.connection.on("disconneected", () => {
    logger.warn(`[MongoDB] Disconnected from ${host}`);
    process.exit(1);
  });
  mongoose.connection.on("error", (error) => {
    logger.error(
      `[MongoDB] Error on Connection ${dbname}@${host}: ${error.message}`,
    );
    process.exit(1);
  });
  mongoose.connection.on("reconnected", () => {
    logger.info(
      `[MongoDB] Successfully reconnected ${dbname}@${host} on PID ${pid}`,
    );
  });
  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      logger.warn(
        `[MongoDB] Disconnected ${dbname}@${host} by the end of service`,
      );
      process.exit(0);
    });
  });

  return promise;
}
