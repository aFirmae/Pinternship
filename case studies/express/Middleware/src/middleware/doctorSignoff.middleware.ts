import { Request, Response, NextFunction } from "express";
import { DischargeBody } from "../types/discharge.types";

export function doctorSignoffCheck(
    req: Request<{}, {}, DischargeBody>,
    res: Response,
    next: NextFunction
): void {
    if (!req.body.doctorSigned) {
        res
            .status(400)
            .json({ error: "Doctor sign-off required before discharge." });
        return;
    }
    req.dischargeLog.push({
        step: "doctorSignoff",
        time: new Date().toISOString(),
    });
    next();
}
