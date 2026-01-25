// Function to process a transaction
function processTransaction(amount: number, description: string | undefined = undefined, isCredit: boolean = false): void | never {
    if (amount < 0) {
        throw new Error("Amount cannot be negative");
    }
    const transactionType = isCredit ? "Credit" : "Debit";
    const transactionDescription = description ?? "No description";

    console.log(`Processing transaction: Amount: ${amount}, Description: ${transactionDescription}, Type: ${transactionType}`);
}

try {
    processTransaction(-100, "Processed on 2024-01-25", true);
} catch (error) {
    if (error instanceof Error) {
        console.error(error.message);
    }
}

processTransaction(100, "Processed on 2024-01-25", true);
processTransaction(100);