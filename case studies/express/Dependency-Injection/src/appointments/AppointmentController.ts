// appointments/AppointmentController.ts
import { Request, Response } from "express";
import { Container } from "typedi";
import { AppointmentService } from "./AppointmentService";

export async function bookAppointmentHandler(
    req: Request,
    res: Response
): Promise<void> {
    const { patient, time, amount } = req.body;
    const appointmentService = Container.get(AppointmentService);
    const result = await appointmentService.bookAppointment(
        patient,
        time,
        amount
    );
    res.json(result);
}
