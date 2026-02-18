function describePerson(name: string, age?: number) {
    console.log(`Name: ${name}, Age: ${age ? age : "Unknown"}`);
}

function calculatePrice(price: number, discount: number = 0.1) {
    return price - (price * discount);
}

// Test Calls
describePerson("Eve");
describePerson("Frank", 28);
console.log(calculatePrice(100));      // 90
console.log(calculatePrice(100, 0.2)); // 80