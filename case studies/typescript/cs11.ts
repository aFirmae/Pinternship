type Transaction = {
  id: number;
  type: "checkout" | "return" | "cancelled" | "priority";
};

const transactions: Transaction[] = [
  { id: 1, type: "checkout" },
  { id: 2, type: "cancelled" },
  { id: 3, type: "return" },
  { id: 4, type: "priority" },
  { id: 5, type: "checkout" }
];

const inventory: { [key: string]: number } = {
  "The Hobbit": 3,
  "1984": 5,
  "TypeScript Guide": 2
};

const visitors: string[] = ["Alice", "Bob", "Carol"];

// Transaction Counter
let transCount = {
    checkout: 0,
    return: 0,
    priority: 0,
    cancelled: 0
} 

for (let i = 0; i < transactions.length; i++) {
    transCount[transactions[i].type]++;
}

console.log(transCount);

// Break when priority is encountered
let i: number = 0;
while (true) {
    if (transactions[i].type === "priority") {
        break;
    }
    i++;
}

// Dynamic queue
let trans = [...transactions];
do {
    let current = trans.shift();
    if (current && current.type === "return") {
        console.log(`Handling return transaction ${current.id}`);
    } 
} while (trans.length > 0);


// Reset inventory count to 0
for (let books in inventory) {
    inventory[books] = 0;
}

// Visitor names in reverse order
for (let visitor of visitors.toReversed()) {
    console.log(visitor);
}
