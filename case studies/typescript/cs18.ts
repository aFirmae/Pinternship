interface PaymentGateway {
  processPayment(amount: number): Promise<boolean>;
}

class PaymentProcessor implements PaymentGateway {
  private gateway: PaymentGateway;

  constructor(gateway: PaymentGateway) {
    this.gateway = gateway;
  }

  async processPayment(amount: number): Promise<boolean> {
    return await this.gateway.processPayment(amount);
  }

  async pay(amount: number): Promise<void> {
    const success = await this.gateway.processPayment(amount);
    if (success) {
      console.log("Payment successful!");
    } else {
      console.log("Payment failed.");
    }
  }
}


class BankTransferGateway implements PaymentGateway {
    async processPayment(amount: number): Promise<boolean> {
        console.log(`Processing bank transfer of $${amount}.`);
        // Simulate API call...
        return true;
    }
}

const bankGateway = new BankTransferGateway();
const processor = new PaymentProcessor(bankGateway);
processor.pay(300);


class FailingMockGateway implements PaymentGateway {
    async processPayment(amount: number): Promise<boolean> {
        console.log(`Mock payment of $${amount} failed.`);
        return false;
    }
}

const failingGateway = new FailingMockGateway();
const errorTestProcessor = new PaymentProcessor(failingGateway);
errorTestProcessor.pay(999);