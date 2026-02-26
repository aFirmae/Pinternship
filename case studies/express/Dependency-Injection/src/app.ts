import "reflect-metadata";
import express from "express";
import { Container } from "typedi";
import { EmailService } from "./notifications/EmailService";
import { NotificationService } from "./notifications/NotificationService";
import appointmentRoutes from "./routes/appointmentRoutes";

Container.set(NotificationService, new EmailService());

const app = express();
app.use(express.json());

app.use("/api/appointments", appointmentRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
    console.log(`POST http://localhost:${PORT}/api/appointments/book`);
});

export default app;
