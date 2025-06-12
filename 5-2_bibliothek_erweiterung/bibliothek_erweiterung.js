import express from 'express';
import { randomUUID } from 'node:crypto';
const app = express()
app.use(express.json())

const books = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565' },
    { title: '1984', author: 'George Orwell', isbn: '9780451524935' },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084' },
    { title: 'Moby Dick', author: 'Herman Melville', isbn: '9781503280786' },
    { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9781503290563' }
]
const port =  3000

app.get('/books', (req, res) => {
    res.json(books)
})

app.get('/books/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn)
    if (!book) {
        return res.status(404).json({ error: 'Book not found' })
    }
    res.json(book)
})

app.post('/books', (req, res) => {
    if (!req.body.title || !req.body.author || !req.body.isbn) {
        res.sendStatus(422)
    }
    if (books.find(b => b.isbn === req.body.isbn)) {
        return res.status(409).json({ error: 'ISBN must be unique' })
    }
    const newBook = req.body
    books.push(newBook)
    res.status(201).json(newBook)
})

app.put('/books/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn)
    if (!book) {
        return res.status(404).json({ error: 'Book not found' })
    }
    if (!req.body.title || !req.body.author || !req.body.isbn) {
        res.sendStatus(422)
    }
    if (books.find(b => b.isbn === req.body.isbn)) {
        return res.status(409).json({ error: 'ISBN must be unique' })
    }
    Object.assign(book, req.body)
    res.json(book)
})

app.delete('/books/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn)
    if (!book) {
        return res.status(404).json({ error: 'Book not found' })
    }
    books.splice(books.indexOf(book), 1)
    res.sendStatus(204)
})

app.patch('/books/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn)
    if (!book) {
        return res.status(404).json({ error: 'Book not found' })
    }
    if (books.find(b => b.isbn === req.body.isbn)) {
        return res.status(409).json({ error: 'ISBN must be unique' })
    }
    const update = req.body
    if (update.title) book.title = update.title
    if (update.author) book.author = update.author
    if (update.isbn) book.isbn = update.isbn
    res.json(book)
})

app.listen(port, () => {
    console.log(`Bibliothek-API läuft auf http://localhost:${port}`)
})
const lends = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        customer_id: 'cust_001',
        isbn: '9780743273565',
        borrowed_at: '2024-01-15T10:30:00.000Z',
        returned_at: null
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        customer_id: 'cust_002',
        isbn: '9780451524935',
        borrowed_at: '2024-01-10T14:15:00.000Z',
        returned_at: '2024-01-20T09:45:00.000Z'
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440003',
        customer_id: 'cust_003',
        isbn: '9780061120084',
        borrowed_at: '2024-01-18T16:20:00.000Z',
        returned_at: null
    }
];

app.get('/lends', (req, res) => {
    res.json(lends);
});

app.get('/lends/:id', (req, res) => {
    const lend = lends.find(l => l.id === req.params.id);
    if (!lend) {
        return res.status(404).send("Lend not found")
    }
    res.json(lend);
});

app.post('/lends', (req, res) => {
    if (!req.body.customer_id || !req.body.isbn || !req.body.borrowed_at) {
        return res.status(422).send("customer_id, isbn and borrowed_at are required");
    }
    if (lends.find(l => l.borrowed_at).size >= 3){
        return res.status(429).send("Maximum number of lends reached for this customer");
    }
    
    const book = books.find(b => b.isbn === req.body.isbn);
    if (!book) {
        return res.status(404).send("Book not found");
    }
    
    const existingLend = lends.find(l => l.isbn === req.body.isbn && !l.returned_at);
    if (existingLend) {
        return res.status(409).send("Book is already lent out");
    }
    
    const newLend = {
        id: randomUUID(),
        customer_id: req.body.customer_id,
        isbn: req.body.isbn,
        borrowed_at: new Date().toISOString(),
        returned_at: null
    };
    
    lends.push(newLend);
    res.status(201).json(newLend);
});

app.delete('/lends/:id', (req, res) => {
    const lend = lends.find(l => l.id === req.params.id);
    if (!lend) {
        return res.status(404).send("Lend not found");
    }
    
    if (lend.returned_at) {
        return res.status(409).send("Book already returned");
    }
    
    lend.returned_at = new Date().toISOString();
    res.sendStatus(204);
});



