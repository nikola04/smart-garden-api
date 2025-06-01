import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
// import helmet from "helmet";
import apiRouter from "./routes";
import db from "./configs/db.config";
import { logger } from "./configs/logger.config";
const app = express();

app.set("trust proxy", 1);
app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, sameSite: "strict", httpOnly: true }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", apiRouter);

try {
    db.connect().then(() => logger.info("Database conected successfully."));
    if(!process.env.PORT) throw "PORT is not defined in ENV.";
    app.listen(process.env.PORT, () => logger.info(`Server is listening on ${process.env.PORT}.`));
} catch (err) {
    logger.error(`❌ ${err}`);
    process.exit(1);
}
