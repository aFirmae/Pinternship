// tests/AppointmentService.test.ts
import "reflect-metadata";
import { Container } from "typedi";
import { AppointmentService } from "../appointments/AppointmentService";
import { NotificationService } from "../notifications/NotificationService";
import { BillingService } from "../billing/BillingService";
import { SMSService } from "../notifications/SMSService";
import { StripeBillingService } from "../billing/StripeBillingService";

class MockNotifier implements NotificationService {
    messages: string[] = [];
    async send(to: string, message: string): Promise<void> {
        this.messages.push(`${to}: ${message}`);
    }
}

class MockBilling implements BillingService {
    charges: string[] = [];
    async charge(patient: string, amount: number): Promise<void> {
        this.charges.push(`${patient}: $${amount}`);
    }
}

test("should send notification on booking", async () => {
    const mock = new MockNotifier();
    Container.set(NotificationService, mock);

    const service = Container.get(AppointmentService);
    await service.bookAppointment("bob@example.com", "Tuesday 2pm", 100);

    expect(mock.messages).toContain("bob@example.com: Your appointment is booked for Tuesday 2pm");
});

test("should charge patient on booking", async () => {
    Container.reset(); 
    
    const mockNotifier = new MockNotifier();
    const mockBilling = new MockBilling();
    Container.set(SMSService, mockNotifier);
    Container.set(StripeBillingService, mockBilling);

    const service = Container.get(AppointmentService);
    await service.bookAppointment("bob@example.com", "Tuesday 2pm", 75);

    expect(mockBilling.charges).toContain("bob@example.com: $75");
});
