import express from 'express';
const app = express();
const port = 3003;
app.use(express.json());

app.get('/public', (req, res) => {
	res.status(200).send('Öffentlicher Endpunkt');
});

app.get('/private', (req, res) => {
	const auth = req.headers['authorization'];
	if (!auth) {
		res.setHeader('WWW-Authenticate', 'Basic realm="staging server"');
		return res.status(401).send('Nicht autorisiert');
	}
	console.log(auth);
	const [username, password] = Buffer.from(auth.split(' ')[1], 'base64')
		.toString('ascii')
		.split(':');
	if (username === 'zli' && password === 'zli1234') {
		return res.status(200).send('Privater Endpunkt');
	} else {
		res.setHeader('WWW-Authenticate', 'Basic realm="staging server"');
		return res.status(401).send('Nicht autorisiert');
	}
});
app.listen(port, () => {
	console.log(`Bibliothek-API läuft auf http://localhost:${port}`);
});
