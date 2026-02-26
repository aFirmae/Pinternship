// notifications/EmailService.ts
import { Service } from "typedi";
import { NotificationService } from "./NotificationService";

@Service()
export class EmailService implements NotificationService {
    async send(to: string, message: string): Promise<void> {
        console.log(`Email sent to ${to}: ${message}`);
    }
}
