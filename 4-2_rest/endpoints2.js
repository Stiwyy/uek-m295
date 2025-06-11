import express from 'express';
import bodyParser from 'body-parser';

const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

let names = [];

app.get('/time', (req, res) => {
    const tz = req.query.tz || 'UTC';
    try {
        const now = new Date().toLocaleString('sv-SE', { timeZone: tz });
        res.status(200).type('text/plain').send(now);
    } catch (e) {
        res.status(400).type('text/plain').send('Invalid timezone');
    }
});

app.post('/names', (req, res) => {
    const name = req.body.name;
    if (!name) {
        return res.status(400).type('text/plain').send('Name is required');
    }
    names.push(name);
    res.status(201).type('application/json').json({ names });
});

app.delete('/names', (req, res) => {
    const name = req.query.name;
    if (!name) {
        return res.status(400).type('text/plain').send('Name query parameter required');
    }
    names = names.filter(n => n !== name);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});