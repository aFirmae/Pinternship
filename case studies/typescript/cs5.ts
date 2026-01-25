// Function to record answers
function recordAnswer(questionId: number, answer: unknown): void {
    let answers: Record<number, unknown> = {};

    if (typeof answer === "string" || typeof answer === "number" || Array.isArray(answer)) {
        answers[questionId] = answer;
        console.log(answers);
    }
}

let surveyAnswer: string | number | string[] | boolean = "Yes";
recordAnswer(1, surveyAnswer);

surveyAnswer = 5;
recordAnswer(2, surveyAnswer);

surveyAnswer = ["Option A", "Option B"];
recordAnswer(3, surveyAnswer);

// Fails type check as boolean is not a valid answer type
surveyAnswer = true;
recordAnswer(4, surveyAnswer);