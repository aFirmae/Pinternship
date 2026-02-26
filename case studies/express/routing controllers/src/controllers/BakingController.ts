import { JsonController, Get, Post, Param, Body } from "routing-controllers";
import { Order } from "../types";
import { orders, bakingJobs } from "../db";

@JsonController("/baking")
export class BakingController {
  @Post("/start")
  startBaking(@Body() body: { orderId: string }) {
    if (!body || !body.orderId) {
       return { status: "error", error: "orderId is required" };
    }

    const order = orders.find(o => o.id === body.orderId);
    if (!order) {
      return { status: "error", error: "Order not found" };
    }

    if (bakingJobs[order.id]) {
      return { status: "error", error: "This order is already being baked" };
    }

    bakingJobs[order.id] = {
      orderId: order.id,
      status: "baking started",
      startTime: new Date()
    };

    setTimeout(() => {
        if (bakingJobs[order.id]) {
            bakingJobs[order.id].status = "completed";
        }
    }, 5000);

    return { status: "success", message: `Started baking order ${order.id}`, data: bakingJobs[order.id] };
  }

  @Get("/status/:id")
  checkStatus(@Param("id") id: string) {
    const job = bakingJobs[id];
    if (!job) {
       return { status: "error", error: "No baking job found for this order ID" };
    }
    return { status: "success", data: job };
  }
}
