import { createServer } from "node:http";
import { loadConfig } from "./lib/config.js";
import { createLogger } from "./lib/logger.js";
import { handleRequest } from "./server.js";

const config = loadConfig();
const logger = createLogger("bootstrap");

const server = createServer((req, res) => {
  void handleRequest(req, res, config, logger);
});

server.listen(config.port, () => {
  logger.info(`demo server listening on :${config.port}`);
});
