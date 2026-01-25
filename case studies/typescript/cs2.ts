/*
I created a variable for my favorite fruit and printed it.
I wrote a function that takes a number and prints double its value.
I added a single-line and a multi-line comment to my code.
I defined a class called Person with a method sayHello that prints a greeting.
*/

// Logs my favorite fruit
let favFruit: string = "Grapes";
console.log(`My favorite fruit is ${favFruit}.`);

// Returns the double of a number
function doubleNumber(num: number): number {
    return num * 2;
}
console.log(doubleNumber(5));

// Person class with a method sayHello
class Person {
    sayHello(): void {
        console.log("Hello!");
    }
}

let p: Person = new Person();
p.sayHello();
