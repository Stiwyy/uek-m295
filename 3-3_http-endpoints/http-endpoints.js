import express from 'express';
import fs from 'node:fs';

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

app.get('/html', (req, res) => {
    fs.readFile('test.html', 'utf8', function(err, text){
        res.send(text);
    })
})

app.get('/image', (req, res) => {
    fs.readFile('image.png', function(err, image){
        res.writeHead(200, {'Content-Type': 'image/png'});
        res.end(image);
    })
})

app.get('/teapot', (req, res) => {
    res.status(418).send("I'm a teapot");
});

app.get('/user-agent', (req, res) => {
    const userAgent = req.headers['user-agent'];
    res.send(`Your User-Agent is: ${userAgent}`);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
