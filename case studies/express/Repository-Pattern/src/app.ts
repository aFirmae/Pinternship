// app.ts
import express, { Request, Response } from 'express';
import { InMemoryCourseRepository } from './repositories/InMemoryCourseRepository';
import { CourseService } from './services/CourseService';

const app = express();
app.use(express.json());

const courseRepo = new InMemoryCourseRepository();
const courseService = new CourseService(courseRepo);

// Some demo courses
courseRepo.save({ id: '1', name: 'Physics 101', capacity: 2, students: [] });
courseRepo.save({ id: '2', name: 'Math 201', capacity: 30, students: [] });

app.post('/courses/:id/enroll', async (req: Request, res: Response) => {
    try {
        const result = await courseService.enroll(req.params.id as string, req.body.studentId);
        res.json(result);
    } catch (e: any) {
        res.status(400).json({ error: e.message });
    }
});

app.get('/students/:id/courses', async (req: Request, res: Response) => {
    const courses = await courseService.getStudentCourses(req.params.id as string);
    res.json(courses);
});

// delete course route
app.delete('/courses/:id', async (req: Request, res: Response) => {
    try {
        const result = await courseService.deleteCourse(req.params.id as string);
        res.json(result);
    } catch (e: any) {
        res.status(404).json({ error: e.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
