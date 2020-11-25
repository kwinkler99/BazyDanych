const express = require('express');
const router = express.Router({mergeParams: true});
const client = require('../config/redisClient');

router.get('/', async (req, res) => {

    const keys = await client.keys("*")
    const list = []
    keys.map(a => list.push({ 'Talia$a': client.smembers(new Set(a))}))
    return res.send(list);
});

router.get('/:id-deck', async (req, res) => {
    return res.send({});
});

router.post('/', async (req, res) => {
    const id = req.body.id
    const deck = req.body.deck.split(",")
    const result = await client.set(id, new Set(deck), "NX");
    if (result){
        return res.send(result);
    }
    else{
        return res.send("Taki klucz juz istnieje")
    }
});

router.post('/new-game', async (req, res) => {
    return res.send(req.body);
});




module.exports = router;
