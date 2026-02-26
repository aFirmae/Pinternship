import express from "express";
import applyRouter from "./routes/apply.ts";

const app = express();

app.use(express.json());

app.use("/", applyRouter);

app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`BrightFuture University Admissions server running on http://localhost:${PORT}`);
});
