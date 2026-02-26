// routes/appointmentRoutes.ts
import { Router } from "express";
import { bookAppointmentHandler } from "../appointments/AppointmentController";

const router = Router();

// POST /api/appointments/book
// Body: { patient: string, time: string, amount: number }
router.post("/book", bookAppointmentHandler);

export default router;
