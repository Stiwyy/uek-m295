import express from 'express';

const app = express();
const port = 3000;

app.get('/now', (req, res) => {
    const now = new Date();
    res.send(`Aktuelle Zeit: ${now.toLocaleTimeString()}`);
});

app.get('/zli', (req, res) => {
    res.redirect('https://www.zli.ch');
})

app.get('/name', (req, res) => {
    const names =["Max", "Moritz", "Anna", "Lena", "Paul", "Laura", "Tim", "Sophie", "Ben", "Lisa",
        "Jonas", "Emma", "Leon", "Mia", "Lukas", "Nina", "Felix", "Sarah", "Tom", "Julia"];
    const randomName = names[Math.floor(Math.random() * names.length)];
    res.send(`Zufälliger Name: ${randomName}`);
})
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
