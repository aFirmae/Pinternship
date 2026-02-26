import { Request, Response, NextFunction } from "express";
import { DischargeBody } from "../types/discharge.types";

export function pharmacyReview(
    req: Request<{}, {}, DischargeBody>,
    res: Response,
    next: NextFunction
): void {
    if (!req.body.pharmacyChecked) {
        res
            .status(400)
            .json({ error: "Pharmacy review required before discharge." });
        return;
    }
    req.dischargeLog.push({
        step: "pharmacyReview",
        time: new Date().toISOString(),
    });
    next();
}
