// notifications/NotificationService.ts
export abstract class NotificationService {
    abstract send(to: string, message: string): Promise<void>;
}
