import { CronJob } from "cron";
import { Config, createAuthHandler, generateCredentials } from "easy-token-auth";
import { logger } from "./logger.config";

export const authConfig: Config = {
    default: { expiry: 420 /* 7 minutes */ },
    refresh_token: { expiry: 2592000 /* 30 days */ },
    access_token: { expiry: 600 /* 10 minutes */ },
    credentials_limit: 5
};

export const authHandler = createAuthHandler(authConfig);

const generateAndSetCredentials = (): void => {
    logger.info("Generating new credentials...");
    const credentials = generateCredentials("ES384");
    authHandler.setCredentials(credentials);
};

CronJob.from({
    cronTime: "0 0 * * 1", // every monday
    onTick: generateAndSetCredentials,
    start: true,
    timeZone: "America/Los_Angeles"
});

generateAndSetCredentials();
