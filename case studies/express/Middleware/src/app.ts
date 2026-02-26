import express, { Application } from "express";
import cors from "cors";
import { logDischargeRequest } from "./middleware/logger.middleware";
import { errorHandler } from "./middleware/errorHandler.middleware";
import dischargeRouter from "./routes/discharge.routes";

function createApp(): Application {
    const app: Application = express();

    app.use(express.json());
    app.use(cors());
    app.use(logDischargeRequest);
    app.use("/discharge", dischargeRouter);
    app.use(errorHandler);

    return app;
}

export default createApp;
