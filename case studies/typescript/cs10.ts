// Positive number checker
const checkSign = (num: number): void => {
    if (num > 0) {
        console.log(`${num} is positive`);
    }
}

// Even Odd checker
const checkEvenOdd = (num: number): void => {
    if ((num & 1) === 0) {
        console.log(`${num} is even`);
    } else {
        console.log(`${num} is odd`);
    }
}

// Grade calculation
const getGrade = (score: number): string => {
    if (score >= 90) {
        return 'A';
    } else if (score >= 80) {
        return 'B';
    } else if (score >= 70) {
        return 'C';
    } else if (score >= 60) {
        return 'D';
    } else {
        return 'F';
    }
}

// Feedback upon grade
const getFeedback = (grade: string): string => {
    switch (grade) {
        case 'A':
            return 'Excellent!';
        case 'B':
            return 'Good!';
        case 'C':
            return 'Average!';
        case 'D':
            return 'Needs Improvement!';
        case 'F':
            return 'Fail!';
        default:
            return 'Invalid Grade!';
    }
}


checkSign(10);
checkEvenOdd(37);
console.log(getGrade(90));
console.log(getFeedback(getGrade(40)));