import express from "express";

const app = express();
const port = 3000;

app.get('/hello', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})