import { Request, Response, NextFunction } from "express";
import { DischargeBody } from "../types/discharge.types";

export function followupCheck(
    req: Request<{}, {}, DischargeBody>,
    res: Response,
    next: NextFunction
): void {
    if (!req.body.followupScheduled) {
        res
            .status(400)
            .json({ error: "Follow-up appointment must be scheduled." });
        return;
    }
    req.dischargeLog.push({
        step: "followupCheck",
        time: new Date().toISOString(),
    });
    next();
}
