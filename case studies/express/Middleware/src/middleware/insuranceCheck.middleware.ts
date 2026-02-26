import { Request, Response, NextFunction } from "express";
import { DischargeBody } from "../types/discharge.types";

export function insuranceCheck(
    req: Request<{}, {}, DischargeBody>,
    res: Response,
    next: NextFunction
): void {
    if (!req.body.insuranceApproved) {
        res
            .status(403)
            .json({ error: "Insurance approval is required before discharge." });
        return;
    }
    req.dischargeLog.push({
        step: "insuranceCheck",
        time: new Date().toISOString(),
    });
    next();
}
