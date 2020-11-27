const { v4: uuidv4 } = require('uuid');
const express = require('express');
const router = express.Router({mergeParams: true});
const client = require('../config/redisClient');

router.get('/', async (req, res) => {
    const keys = await client.keys("*")
    const list = []
    for(let i = 0; i < keys.length; i++){
        list.push({[keys[i]]: await client.smembers(keys[i])})
    }
    return res.send({
        'list': list
    });
});

router.get('/:id-deck', async (req, res) => {
    const keys = await client.keys("*")
    const players = req.body.players
    const cards = req.body.cards
    let list = []

    for(let i = 0; i < players; i++){
        let rand = Math.floor(Math.random() * (keys.length))
        let value = keys[rand]
        list.push({ [value]: await client.spop(`${value}`, cards)})
    }

    return res.send(list);
});

router.post('/', async (req, res) => {
    const id = req.body.id
    const deck = req.body.deck.split(",")
    const result = await client.sadd(`game:${id}`, deck);
    if (result){
        return res.send(
            {
                id: id,
                cards: deck
            }
        );
    }
});

router.post('/new-game', async (req, res) => {
    const id = req.body.id;
    const deckId = uuidv4();
    await client.sunionstore(`game:${id}:deck:${deckId}-deck`, `game:${id}`);
    return res.send({
        'id-deck': deckId  
    });
});




module.exports = router;
