// Variables Scopes and Redeclaration
let score: number = 10;
// let score: number = 30; // Error: Cannot redeclare block-scoped variable 'score'.
console.log(`Old Score: ${score}`);

function updateScore(): void {
    let score: number = 20;
    console.log(`New Score: ${score}`);
}

updateScore();

const country: string = "India";
// country = "USA"; // Error: Cannot assign to 'country' because it is a constant.
console.log(`Country: ${country}`);