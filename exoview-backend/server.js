require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

const url = process.env.MONGODB_URI;


app.get('/', (req, res) => {
    res.send('<p>Hello World!</p>');
});

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
});