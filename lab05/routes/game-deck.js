const express = require('express');
const router = express.Router({mergeParams: true});
const client = require('../config/redisClient');

router.get('/', async (req, res) => {
    const keys = await client.keys("*")
    const list = []
    for(let i = 0; i < keys.length; i++){
        list.push({['Talia ' + keys[i]]: await client.smembers(keys[i])})
    }
    return res.send({
        'list': list
    });
});

router.get('/:id-deck', async (req, res) => {
    return res.send({});
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
    const id = req.body.id
    return res.send(req.body);
});




module.exports = router;
