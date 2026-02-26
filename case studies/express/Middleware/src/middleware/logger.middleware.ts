import { Request, Response, NextFunction } from "express";
import { DischargeLogEntry } from "../types/discharge.types";

declare global {
    namespace Express {
        interface Request {
            dischargeLog: DischargeLogEntry[];
        }
    }
}

export function logDischargeRequest(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    req.dischargeLog = req.dischargeLog || [];
    req.dischargeLog.push({
        step: "requestReceived",
        time: new Date().toISOString(),
    });
    next();
}
