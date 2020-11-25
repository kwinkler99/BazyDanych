const express = require('express');
const router = express.Router({mergeParams: true});
const client = require('../config/redisClient');

router.get('/', async (req, res) => {
    return res.send({});
});

router.post('/', async (req, res) => {
    return res.send(req.body);
});

router.delete('/', async (req, res) => {
    return res.send({});
});




module.exports = router;
