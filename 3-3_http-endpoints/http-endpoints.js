import express from 'express';

const app = express();
const port = 3000;

app.get('/now', (req, res) => {
    const now = new Date();
    res.send(`Aktuelle Zeit: ${now.toLocaleTimeString()}`);
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
