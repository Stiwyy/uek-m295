import express from 'express';
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
    if (books.find(b => b.isbn === isbn)) {
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
    if (books.find(b => b.isbn === isbn)) {
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
    if (books.find(b => b.isbn === isbn)) {
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




