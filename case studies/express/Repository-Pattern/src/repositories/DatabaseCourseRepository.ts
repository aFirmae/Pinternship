// repositories/DatabaseCourseRepository.ts
import { ICourseRepository } from './interfaces/ICourseRepository';
import { Course } from '../models/Course';

export class DatabaseCourseRepository implements ICourseRepository {
    // Assume db is a connected database client
    constructor(private db: any) { }

    async findAll(): Promise<Course[]> {
        // Use real database queries here
        return this.db.query('SELECT * FROM courses');
    }

    async findById(id: string): Promise<Course | null> {
        // ...
        return null; // Example
    }

    async save(course: Course): Promise<void> {
        // ...implement save to database
    }

    async enrollStudent(courseId: string, studentId: string): Promise<void> {
        // ...implement enroll in database
    }

    async findByStudentId(studentId: string): Promise<Course[]> {
        // ...implement find by student in database
        return [];
    }

    async delete(courseId: string): Promise<void> {
        // ...implement delete from database
    }
}
