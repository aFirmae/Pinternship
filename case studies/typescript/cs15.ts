type Learner = { id: string; quizzesCompleted: number };
type Instructor = { id: string; coursesTaught: number };
type Admin = { id: string; accessLevel: "basic" | "super" };

// Instructor or Admin type
type InstructorOrAdmin = Instructor | Admin;

type Assignment = { 
    title: string; 
    dueDate: Date; 
    points: number 
};

// Readonly version of Assignment
type ReadonlyAssignment = Readonly<Assignment>;


type LearnerStats = { 
    quizzes: number; 
    videos: number; 
    assignments: number; 
};

// Mapped type to convert LearnerStats values to strings
type StatsAsStrings = {
    [K in keyof LearnerStats]: string;
};
