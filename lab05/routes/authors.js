const express = require('express');
const router = express.Router({mergeParams: true});
const client = require('../config/redisClient');

router.get('/', async (req, res) => {
    const sorted = req.body.sorted
    const from = req.body.from 
    const to = req.body.to
    let result = []
    if(sorted === "[0|1]"){
        result = await client.sort("authors", "BY", "score")
    }
    else{
        result = await client.sort("authors", "DESC", "BY", "score")
    }
    const list = []
    for (let i = from-1; i < to; i++){
        list.push(result[i])
    }
    return res.send(list);
});

router.post('/', async (req, res) => {
    const name = req.body.name;
    const surname = req.body.surname;
    const score = req.body.birth;
    const elem = `${name} ${surname}`
    const result = await client.zadd('authors', parseInt(score), elem);
    if (result){
        return res.send({
            'name': elem,
            'year': score 
        });
    }
    else{
        return res.send(
            "Nie udalo sie dodac autora"
        );
    }
});

router.delete('/', async (req, res) => {
    const from = parseInt(req.body.from);
    const to = parseInt(req.body.to);
    const value = await client.zremrangebyscore('authors', from, to)

    return res.send("usunieto");
});




module.exports = router;
