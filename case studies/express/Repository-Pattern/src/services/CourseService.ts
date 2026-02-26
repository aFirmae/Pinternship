// services/CourseService.ts
import { ICourseRepository } from '../repositories/interfaces/ICourseRepository';

export class CourseService {
    constructor(private courseRepo: ICourseRepository) { }

    async enroll(courseId: string, studentId: string) {
        const course = await this.courseRepo.findById(courseId);
        if (!course) throw new Error('Course not found');
        if (course.students.length >= course.capacity) throw new Error('Course full');
        await this.courseRepo.enrollStudent(courseId, studentId);
        return { message: 'Enrolled successfully' };
    }

    async getStudentCourses(studentId: string) {
        return this.courseRepo.findByStudentId(studentId);
    }

    async deleteCourse(courseId: string) {
        const course = await this.courseRepo.findById(courseId);
        if (!course) throw new Error('Course not found');
        await this.courseRepo.delete(courseId);
        return { message: 'Course deleted successfully' };
    }
}
