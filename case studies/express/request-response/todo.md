**A. Typing Requests and Responses**

**1. Defining Strict Interfaces**

**Problem:** Without types, requests like `{ points: "100" }` (string) might be processed as `100` (number), causing bugs.
**Solution:** Use TypeScript interfaces to enforce data shapes.

```
// Loyalty program interfaces
interface RedeemRequest {
  customerId: string;
  points: number;
}

interface ApiResponse<T = any> {
  status: "success" | "error";
  data?: T;
  error?: string;
}
```

**2. Typing Express `Request` and `Response`**

Use generics to lock down body, query, and params:

```
import { Request, Response } from "express";

router.post(
  "/redeem",
  (req: Request<{}, {}, RedeemRequest>, // Body type
   res: Response<ApiResponse<{ remainingPoints: number }>>) => { // Response type
    // ...logic...
  }
);
```

**Why?**

* `req.body` is now strictly typed. Passing `{ points: "100" }` will throw a TypeScript error.
* The response shape is predefined, ensuring consistency.

**B. Validating Data with Zod**

**1. Schema Validation**

**Problem:** TypeScript types are stripped at runtime. Malicious clients can still send invalid data.
**Solution:** Use Zod to validate requests at runtime.

```
import { z } from "zod";

const RedeemSchema = z.object({
  customerId: z.string().uuid(),
  points: z.number().int().positive(),
});

router.post("/redeem", (req, res) => {
  const result = RedeemSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      status: "error",
      error: result.error.errors[0].message,
    });
  }
  // Proceed with validated data (result.data)
});

```

**2. Centralized Validation Middleware** Avoid repeating validation logic:

```
import { RequestHandler } from "express";

function validate<T extends z.ZodTypeAny>(schema: T): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ 
        status: "error", 
        error: result.error.errors[0].message 
      });
    }
    req.body = result.data; // Override req.body with parsed data
    next();
  };
}

// Usage
router.post("/redeem", validate(RedeemSchema), (req, res) => {
  // req.body is now validated and typed!
});

```

**C. Structured Error Handling** **1. Error Hierarchy**

```
Define custom errors for clarity:

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
```

**2. Global Error Middleware**

Catch all errors and send consistent responses:

```
   app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      status: "error",
      error: err.message,
      details: err.details,
    });
  } else {
    // Log unexpected errors but don’t expose details
    console.error(err);
    res.status(500).json({ 
      status: "error", 
      error: "Internal server error" 
    });
  }
});

```

**Usage in routes:**

```
router.post("/redeem", validate(RedeemSchema), (req, res) => {
  const member = findMember(req.body.customerId);
  if (member.points < req.body.points) {
    throw new InsufficientPointsError(); // Caught by global middleware
  }
  // ...redeem points...
});
```

**D. Advanced: Custom Request Properties**

**1. Extending `Request` for Authentication**

Add user data to `req` after authentication:

```
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

// Auth middleware
router.use((req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    req.user = decodeToken(token); // Assume this returns a user object
  }
  next();
});

// Usage in routes
router.get("/profile", (req, res) => {
  if (!req.user) {
    throw new ApiError(401, "Unauthorized");
  }
  res.json({ status: "success", data: req.user });
});

```

**E. Real-World Example: Full Redeem Endpoint**

```
router.post(
  "/redeem",
  validate(RedeemSchema),
  async (req: Request<{}, {}, RedeemRequest>, res: Response) => {
    const { customerId, points } = req.body;

    // Check customer exists
    const member = await db.loyaltyMembers.findOne({ customerId });
    if (!member) {
      throw new ApiError(404, "Customer not found");
    }

    // Check points
    if (member.points < points) {
      throw new InsufficientPointsError();
    }

    // Check item availability
    const item = await db.inventory.findOne({ sku: "CAKE" });
    if (!item || item.stock < 1) {
      throw new ApiError(409, "Item out of stock");
    }

    // Deduct points and update inventory
    await db.loyaltyMembers.updateOne(
      { customerId },
      { $inc: { points: -points } }
    );
    await db.inventory.updateOne({ sku: "CAKE" }, { $inc: { stock: -1 } });

    // Success!
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

```

## Step-by-Step Data Flow

1. **Request Received:**
   * Client sends `POST /redeem` with `{ customerId: "123", points: 500 }`.
2. **Validation Middleware:**
   * Zod checks if `points` is a positive integer.
   * If invalid, returns `400 Bad Request` with error details.
3. **Authentication Middleware:**
   * Checks `Authorization` header and attaches `req.user`.
4. **Business Logic:**
   * Checks customer existence, points, and inventory.
   * Throws specific errors for each failure case.
5. **Global Error Handler:**
   * Catches errors and sends structured responses.
6. **Success Response:**
   * Returns `200 OK` with remaining points and redeemed item.

## Interactive Challenge

**Your Turn!**

1. Add a `POST /transfer` endpoint allowing customers to transfer points to another account.
2. Validate:
   * Both `fromCustomerId` and `toCustomerId` must be valid UUIDs.
   * `points` must be a positive integer.
   * The sender must have enough points.
3. Return appropriate errors for each failure case.
