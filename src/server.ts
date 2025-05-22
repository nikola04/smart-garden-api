import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/report", (req, res) => {
    console.log(req.body);
    res.json({ status: "OK" });
});

app.listen(3000, () => console.log("> Server is listening on", `http://localhost:${3000}/`));
