import express from "express";
import cookieParser from "cookie-parser";
import apiRouter from "./routes";
import db from "./configs/database";
const app = express();

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
