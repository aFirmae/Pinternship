import { IBookRepository } from './interfaces/IBookRepository';
import { Book } from '../models/Book';

export class InMemoryBookRepository implements IBookRepository {
    private books: Book[] = [];

    async findAll(): Promise<Book[]> {
        return this.books;
    }

    async findById(id: string): Promise<Book | null> {
        return this.books.find(book => book.id === id) || null;
    }

    async save(book: Book): Promise<void> {
        this.books.push(book);
    }

    // update the book's status in the repository
    async update(book: Book): Promise<void> {
        const index = this.books.findIndex(b => b.id === book.id);
        if (index !== -1) {
            this.books[index] = book;
        }
    }
}
