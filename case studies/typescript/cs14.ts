// Generic class to store feedback items
class FeedbackBox<T> {
    private items: T[] = [];

    addFeedback(item: T): void {
        this.items.push(item);
    }

    getAllFeedback(): T[] {
        return this.items;
    }
}

// Generic function to get first item from array
function getFirstItem<T>(array: T[]): T | undefined {
    return array[0];
}


const stringFeedback = new FeedbackBox<string>();
stringFeedback.addFeedback("Great work!");
stringFeedback.addFeedback("Needs improvement");
console.log(stringFeedback.getAllFeedback());

const numberArray = [10, 20, 30];
console.log(getFirstItem(numberArray));