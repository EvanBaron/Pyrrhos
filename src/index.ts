import { PyrrhosClient } from "./client";
import "./lib/setup";

const client = new PyrrhosClient();

const main = async () => {
  try {
    process.env.NODE_ENV == "dev"
      ? client.logger.info("Development Mode Enabled, Registering Commands to test guild")
      : null;

    client.logger.info("Logging in...");
    return client.login(process.env.CLIENT_TOKEN);
  } catch (error) {
    client.logger.fatal(error);
    client.destroy();
    process.exit(1);
  }
};

void main();
