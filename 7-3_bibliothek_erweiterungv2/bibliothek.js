import express from 'express';
import { randomUUID } from 'node:crypto';
import session from 'express-session';
const app = express();

app.use(
	session({
		secret: '0450345d4f5a6b7c8d9e0f1g2h3i4j5k6l7m8n9o0p1q2r3s4t5u6v7w8x9y0z',
		resave: false,
		saveUninitialized: true,
	})
);
app.use(express.json());

const email = 'desk@library.example';
const password = 'm295';

let books = [
	{
		title: 'The Great Gatsby',
		author: 'F. Scott Fitzgerald',
		isbn: '9780743273565',
	},
	{ title: '1984', author: 'George Orwell', isbn: '9780451524935' },
	{
		title: 'To Kill a Mockingbird',
		author: 'Harper Lee',
		isbn: '9780061120084',
	},
	{ title: 'Moby Dick', author: 'Herman Melville', isbn: '9781503280786' },
	{
		title: 'Pride and Prejudice',
		author: 'Jane Austen',
		isbn: '9781503290563',
	},
	{ title: 'kfdjd', author: 'sdfkjdsfj', isbn: '1234' },
	{ title: 'kfdjd', author: 'sdfkjdsfj', isbn: '12345' },
	{ title: 'kfdjd', author: 'sdfkjdsfj', isbn: '123456' },
];
const port = 3000;

app.get('/books', (req, res) => {
	res.json(books);
});

app.get('/books/:isbn', (req, res) => {
	const book = books.find((b) => b.isbn === req.params.isbn);
	if (!book) {
		return res.status(404).json({ error: 'Book not found' });
	}
	res.json(book);
});

app.post('/books', (req, res) => {
	if (!req.body.title || !req.body.author || !req.body.isbn) {
		res.sendStatus(422);
	}
	if (books.find((b) => b.isbn === req.body.isbn)) {
		return res.status(409).json({ error: 'ISBN must be unique' });
	}
	const newBook = req.body;

	//Sollte nicht push verwenden, sondern die ... Spread-Syntax

	// books.push(newBook)
	books = [...books, newBook];
	res.status(201).json(newBook);
});

app.put('/books/:isbn', (req, res) => {
	const book = books.find((b) => b.isbn === req.params.isbn);
	if (!book) {
		return res.status(404).json({ error: 'Book not found' });
	}
	if (!req.body.title || !req.body.author || !req.body.isbn) {
		res.sendStatus(422);
	}
	if (books.find((b) => b.isbn === req.body.isbn)) {
		return res.status(409).json({ error: 'ISBN must be unique' });
	}
	books = books.map((b) =>
		b.isbn === req.params.isbn ? { ...req.body } : b
	);
	res.json(req.body);
	res.json(book);
});

app.delete('/books/:isbn', (req, res) => {
	const book = books.find((b) => b.isbn === req.params.isbn);
	if (!book) {
		return res.status(404).json({ error: 'Book not found' });
	}
	books = books.filter((b) => b.isbn !== req.params.isbn);
	res.sendStatus(204);
});

app.patch('/books/:isbn', (req, res) => {
	const index = books.findIndex((b) => b.isbn === req.params.isbn);
	if (index === -1) {
		return res.status(404).json({ error: 'Book not found' });
	}

	if (
		req.body.isbn &&
		req.body.isbn !== req.params.isbn &&
		books.find((b) => b.isbn === req.body.isbn)
	) {
		return res.status(409).json({ error: 'ISBN must be unique' });
	}

	const updatedBook = {
		...books[index],
		...req.body,
	};

	books = books.map((b, i) => (i === index ? updatedBook : b));

	res.json(updatedBook);
});

app.listen(port, () => {
	console.log(`Bibliothek-API läuft auf http://localhost:${port}`);
});
let lends = [
	{
		id: '550e8400-e29b-41d4-a716-446655440001',
		customer_id: 'cust_001',
		isbn: '9780743273565',
		borrowed_at: '2024-01-15T10:30:00.000Z',
		returned_at: null,
	},
	{
		id: '550e8400-e29b-41d4-a716-446655440002',
		customer_id: 'cust_002',
		isbn: '9780451524935',
		borrowed_at: '2024-01-10T14:15:00.000Z',
		returned_at: '2024-01-20T09:45:00.000Z',
	},
	{
		id: '550e8400-e29b-41d4-a716-446655440003',
		customer_id: 'cust_003',
		isbn: '9780061120084',
		borrowed_at: '2024-01-18T16:20:00.000Z',
		returned_at: null,
	},
];

app.get('/lends', (req, res) => {
	if (!req.session.authenticated) {
		return res.status(401).send('Unauthorized');
	}
	res.json(lends);
});

app.get('/lends/:id', (req, res) => {
	if (!req.session.authenticated) {
		return res.status(401).send('Unauthorized');
	}
	const lend = lends.find((l) => l.id === req.params.id);
	if (!lend) {
		return res.status(404).send('Lend not found');
	}
	res.json(lend);
});

app.post('/lends', (req, res) => {
	if (!req.session.authenticated) {
		return res.status(401).send('Unauthorized');
	}
	if (!req.body.customer_id || !req.body.isbn || !req.body.borrowed_at) {
		return res
			.status(422)
			.send('customer_id, isbn and borrowed_at are required');
	}
	if (
		lends.filter(
			(l) =>
				l.customer_id === req.body.customer_id && l.returned_at === null
		).length >= 3
	) {
		return res
			.status(429)
			.send('Maximum number of lends reached for this customer');
	}

	const book = books.find((b) => b.isbn === req.body.isbn);
	if (!book) {
		return res.status(404).send('Book not found');
	}

	const existingLend = lends.find(
		(l) => l.isbn === req.body.isbn && !l.returned_at
	);
	if (existingLend) {
		return res.status(409).send('Book is already lent out');
	}

	const newLend = {
		id: randomUUID(),
		customer_id: req.body.customer_id,
		isbn: req.body.isbn,
		borrowed_at: new Date().toISOString(),
		returned_at: null,
	};

	//Sollte nicht push verwenden, sondern die ... Spread-Syntax
	lends = [...lends, newLend];
	//lends.push(newLend);
	res.status(201).json(newLend);
});

app.delete('/lends/:id', (req, res) => {
	if (!req.session.authenticated) {
		return res.status(401).send('Unauthorized');
	}
	const lend = lends.find((l) => l.id === req.params.id);
	if (!lend) {
		return res.status(404).send('Lend not found');
	}

	if (lend.returned_at) {
		return res.status(409).send('Book already returned');
	}
	lend.returned_at = new Date().toISOString();
	res.sendStatus(204);
});

app.post('/login', (req, res) => {
	if (!req.body.email || !req.body.password) {
		return res.status(422).send('Username and password are required');
	}

	if (req.body.email === email && req.body.password === password) {
		req.session.authenticated = true;
		return res.sendStatus(201);
	}
	req.session.authenticated = false;
	return res.status(401).send('Invalid credentials');
});

app.get('/verify', (req, res) => {
	if (req.session.authenticated) {
		res.body = {
			email: email,
			password: password,
		};
		return res.sendStatus(200);
	}
	return res.status(401).send('Unauthorized');
});

app.delete('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) {
			return res.status(500).send('Could not log out');
		}
	});
	res.sendStatus(204);
});
