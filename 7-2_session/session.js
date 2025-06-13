import express from 'express';
import session from 'express-session';

const app = express();
const port = 3000;
app.use(
	session({
		secret: 'abcd1234',
		resave: false,
		saveUninitialized: true,
		cookie: {},
	})
);

app.use(express.json());

app.post('/:name', (req, res) => {
	const name = req.params.name;
	if (!name) {
		return res.status(400).send('Name is missing');
	}
	req.session.name = name;
	res.send('Name saved in session');
});

app.get('/session', (req, res) => {
	if (req.session.name) {
		res.json({ name: req.session.name });
	} else {
		res.status(404).send({ error: 'No name found in session' });
	}
});

app.delete('/session', (req, res) => {
	if (req.session.name) {
		delete req.session.name;
		res.json({ message: 'Name removed from session' });
	} else {
		res.status(404).json({ error: 'No name found in session' });
	}
});

app.listen(port, () => {
	console.log(`Bibliothek-API läuft auf http://localhost:${port}`);
});
