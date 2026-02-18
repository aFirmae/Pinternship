// Observer interface
interface Observer {
    update(msg: string): void;
}

// Existing observers
class Customer implements Observer {
    update(msg: string): void {
        console.log("Customer:", msg);
    }
}


class Inventory implements Observer {
    update(msg: string): void {
        console.log("Inventory:", msg);
    }
}

class DrinkOrder {
    private observers: Observer[] = [];

    addObserver(obs: Observer): void {
        this.observers.push(obs);
    }

    notifyAll(msg: string): void {
        this.observers.forEach(obs => obs.update(msg));
    }

    completeOrder(): void {
        this.notifyAll("Order complete!");
    }
}

// Promotion System Observer
class PromotionSystem implements Observer {
    private promotionMessage: string;

    constructor(promotionMessage: string) {
        this.promotionMessage = promotionMessage;
    }

    update(msg: string): void {
        console.log("PromotionSystem:", `${this.promotionMessage}`);
    }
}

const order = new DrinkOrder();

order.addObserver(new Customer());
order.addObserver(new Inventory());
order.addObserver(new PromotionSystem("Festive offer: Buy 1 Get 1 Free!"));
order.completeOrder();
