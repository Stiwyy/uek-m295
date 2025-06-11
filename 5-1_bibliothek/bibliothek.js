import express from 'express';
const app = express()
app.use(express.json())

const books = []
const port =  3000

app.get('/books', (req, res) => {
    res.json(books)
})

app.get('book/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn)
    if (!book) {
        return res.status(404).json({ error: 'Book not found' })
    }
    res.json(book)
})

app.post('/books', (req, res) => {
    const newBook = req.body
    if (books.some(b => b.isbn === newBook.isbn)) {
        return res.status(409).json({ error: 'ISBN already exists' })
    }
    books.push(newBook)
    res.status(201).json(newBook)
})

app.put('book/:isbn', (req, res) => {
    const idx = books.findIndex(b => b.isbn === req.params.isbn)
    if (idx === -1) {
        return res.status(404).json({ error: 'Book not found' })
    }
    books[idx] = req.body
    res.json(req.body)
})

app.delete('book/:isbn', (req, res) => {
    const idx = books.findIndex(b => b.isbn === req.params.isbn)
    if (idx === -1) {
        return res.status(404).json({ error: 'Book not found' })
    }
    books.splice(idx, 1)
    res.sendStatus(204)
})

app.listen(port, () => {
    console.log(`Bibliothek-API läuft auf http://localhost:${port}`)
})




