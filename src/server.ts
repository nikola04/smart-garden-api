import express from "express";
import apiRouter from "./api";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", apiRouter);

app.listen(3000, () => console.log("> Server is listening on", `http://localhost:${3000}/`));
