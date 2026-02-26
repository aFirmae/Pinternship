import express from "express";
import { applicationValidation, validationResult } from "../validation/applicationValidation.ts";

const router = express.Router();

router.post("/apply", applicationValidation, (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    res.json({ status: "Application received!" });
});

export default router;
