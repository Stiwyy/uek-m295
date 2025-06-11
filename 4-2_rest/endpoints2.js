import express from 'express';
import bodyParser from 'body-parser';

const port = 3000;

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

let names = [];

// https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for valid time zones
app.get('/now', (req, res) => {
    const tz = req.query.tz || 'UTC';
    try {
        const now = new Date().toLocaleString('sv-SE', { timeZone: tz });
        res.status(200).type('text/plain').send(now);
    } catch (e) {
        res.status(400).type('text/plain').send('Invalid timezone');
    }
});

app.get('/names', (req, res) => {
    if (names.length === 0) {
        return res.status(404).type('text/plain').send('No names found');
    }
    res.status(200).type('application/json').json({ names });
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
    const name = req.body.name;
    if (!name) {
        return res.status(400).type('text/plain').send('Name is required');
    }
    names = names.filter(n => n !== name);
    res.status(204).send();
});
let me = {}

app.get('/auth', (req, res) => {
    const auth = req.get('Authorization')
    if (auth === 'Basic aGFja2VyOjEyMzQ=') {
        return res.sendStatus(200)
    }
    res.sendStatus(401)
})

app.get('/joke', async (req, res) => {
    const name = req.query.name || 'Chuck Norris'
    try {
        const response = await fetch('https://api.chucknorris.io/jokes/random')
        const { value } = await response.json()
        const joke = value.replace(/Chuck Norris/g, name)
        res.status(200).json({ joke })
    } catch {
        res.status(500).send('Error fetching joke')
    }
})

app.patch('/me', (req, res) => {
    Object.assign(me, req.body)
    res.status(200).json(me)
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});