const express = require('express');
const app = express();
const gameDeck = require('./routes/game-deck');
const authors = require('./routes/authors');
require('dotenv').config();

app.use(express.json());
app.use('/game-deck', gameDeck);
app.use('/authors', authors);

// Łączymy się z bazą i „stawiamy” serwer API
// Do kontaktu z serwerem Redis wykorzystamy bibliotekę IORedis
const client = require('./config/redisClient');

client.on('error', err => {
  console.error('Error connecting to Redis', err);
});
client.on('connect', () => {
    console.log(`Connected to Redis.`)
    const port = process.env.PORT || 5000
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
});