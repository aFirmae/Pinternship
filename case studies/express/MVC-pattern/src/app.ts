import express from 'express';
import { BookController } from './controllers/BookController';
import { BookService } from './services/BookService';
import { InMemoryBookRepository } from './repositories/InMemoryBookRepository';
import { Book } from './models/Book';

const app = express();
app.use(express.json());

// Initialize components
const bookRepository = new InMemoryBookRepository();
const bookService = new BookService(bookRepository);
const bookController = new BookController(bookService);

// Some example books
const seedBooks: Book[] = [
    { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isBorrowed: false },
    { id: '2', title: 'To Kill a Mockingbird', author: 'Harper Lee', isBorrowed: false },
    { id: '3', title: '1984', author: 'George Orwell', isBorrowed: false },
];
seedBooks.forEach(book => bookRepository.save(book));

// Routes
app.get('/books', async (_req, res) => {
    const books = await bookRepository.findAll();
    res.json(books);
});

app.post('/books/:id/borrow', (req, res) => bookController.borrowBook(req, res));

// return a book
app.post('/books/:id/return', (req, res) => bookController.returnBook(req, res));

const port = 3000;
app.listen(port, () => {
    console.log(`Library system running on port ${port}`);
});
