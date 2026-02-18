// Alias for string type
type CustomerID = string;

// Alias for object type
type Customer = {
    id: CustomerID;
    name: string;
    email?: string;
}

type OrderStatus = "pending" | "shipped" | "delivered";

// Alias for function type
type ProcessOrder = (orderId: number, callback: (status: OrderStatus) => void) => void;

// Function implementation
const processOrder: ProcessOrder = (orderId, status) => {
    console.log(`Processing order ${orderId}`);
    status("shipped");
}

processOrder(1, (status) => {
    console.log(`Order status: ${status}`);
});

// Generic type
type Container<T> = {
    value: T;
    process: (callback: (value: T) => void) => void;
}

// Usage
let customerContainer: Container<Customer> = {
    value: {
        id: "1",
        name: "Nilashis Saha",
    },
    process: (callback) => {
        callback(customerContainer.value);
    }
}

customerContainer.process((customer) => {
    console.log(`Customer name: ${customer.name}`);
});
    
