import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
// import helmet from "helmet";
import apiRouter from "./routes";
import db from "./configs/db.config";
const app = express();

app.set('trust proxy', 1);
app.use(session({
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/", apiRouter);

try {
    db.connect().then(() => console.log("> Database conected successfully."));
    if(!process.env.PORT) throw "PORT is not defined in ENV variables.";
    app.listen(process.env.PORT, () => console.log("> Server is listening on", `http://localhost:${process.env.PORT}/`));
} catch (error) {
    console.error("❌", error);
    process.exit(1);
}
