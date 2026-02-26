import "express-async-errors";
import { Request, Response, NextFunction, RequestHandler } from "express";
import express from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

interface RedeemRequest {
  customerId: string;
  points: number;
}

interface ApiResponse<T = any> {
  status: "success" | "error";
  data?: T;
  error?: string;
}

const RedeemSchema = z.object({
  customerId: z.string().uuid(),
  points: z.number().int().positive(),
});

function validate<T extends z.ZodTypeAny>(schema: T): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        status: "error", 
        error: (result as any).error.errors[0].message 
      });
    }
    req.body = result.data;
    next();
  };
}

class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: any
  ) {
    super(message);
  }
}

class InsufficientPointsError extends ApiError {
  constructor() {
    super(400, "Insufficient points");
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: "customer" | "admin";
      };
    }
  }
}

const decodeToken = (token: string) => ({ id: "123", role: "customer" as const });

const db = {
  loyaltyMembers: {
    findOne: async (q: any) => ({ customerId: q.customerId, points: 1000 }),
    updateOne: async (q: any, u: any) => ({})
  },
  inventory: {
    findOne: async (q: any) => ({ sku: "CAKE", stock: 1 }),
    updateOne: async (q: any, u: any) => ({})
  }
};

app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    req.user = decodeToken(token);
  }
  next();
});

app.get("/profile", (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  res.json({ status: "success", data: req.user });
});

app.post(
  "/redeem",
  validate(RedeemSchema),
  async (req: Request<{}, {}, RedeemRequest>, res: Response) => {
    const { customerId, points } = req.body;

    const member = await db.loyaltyMembers.findOne({ customerId });
    if (!member) {
      throw new ApiError(404, "Customer not found");
    }

    if (member.points < points) {
      throw new InsufficientPointsError();
    }

    const item = await db.inventory.findOne({ sku: "CAKE" });
    if (!item || item.stock < 1) {
      throw new ApiError(409, "Item out of stock");
    }

    await db.loyaltyMembers.updateOne(
      { customerId },
      { $inc: { points: -points } }
    );
    await db.inventory.updateOne({ sku: "CAKE" }, { $inc: { stock: -1 } });

    res.json({
      status: "success",
      data: { 
        customerId, 
        remainingPoints: member.points - points,
        item: "CAKE" 
      },
    });
  }
);


// /transfer endpoint to transfer points between customers

const TransferSchema = z.object({
  fromCustomerId: z.string().uuid(),
  toCustomerId: z.string().uuid(),
  points: z.number().int().positive(),
});

type TransferRequest = z.infer<typeof TransferSchema>;

app.post(
  "/transfer",
  validate(TransferSchema),
  async (req: Request<{}, {}, TransferRequest>, res: Response) => {
    const { fromCustomerId, toCustomerId, points } = req.body;

    const sender = await db.loyaltyMembers.findOne({ customerId: fromCustomerId });
    if (!sender) {
      throw new ApiError(404, "Sender not found");
    }

    const receiver = await db.loyaltyMembers.findOne({ customerId: toCustomerId });
    if (!receiver) {
      throw new ApiError(404, "Receiver not found");
    }

    if (sender.points < points) {
      throw new InsufficientPointsError();
    }

    await db.loyaltyMembers.updateOne(
      { customerId: fromCustomerId },
      { $inc: { points: -points } }
    );
    await db.loyaltyMembers.updateOne(
      { customerId: toCustomerId },
      { $inc: { points: points } }
    );

    res.json({
      status: "success",
      data: {
        fromCustomerId,
        toCustomerId,
        transferredPoints: points,
        remainingPoints: sender.points - points
      }
    });
  }
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: "error",
      error: err.message,
      details: err.details,
    });
  } else {
    console.error(err);
    res.status(500).json({ 
      status: "error", 
      error: "Internal server error" 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
