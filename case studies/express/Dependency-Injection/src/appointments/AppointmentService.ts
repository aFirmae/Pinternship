// appointments/AppointmentService.ts
import { Service, Inject } from "typedi";
import { NotificationService } from "../notifications/NotificationService";
import { BillingService } from "../billing/BillingService";
import { SMSService } from "../notifications/SMSService";
import { StripeBillingService } from "../billing/StripeBillingService";

@Service()
export class AppointmentService {
    constructor(
        @Inject(() => SMSService) private notifier: NotificationService,
        @Inject(() => StripeBillingService) private billing: BillingService
    ) { }

    async bookAppointment(
        patient: string,
        time: string,
        amount: number
    ): Promise<{ status: string }> {
        await this.billing.charge(patient, amount);
        await this.notifier.send(patient, `Your appointment is booked for ${time}`);
        return { status: "confirmed" };
    }
}
