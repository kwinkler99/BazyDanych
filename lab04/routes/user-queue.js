const express = require('express');
const router = express.Router();
const client = require('../config/redisClient');

router.get('/', async (req, res) => {
    return res.send({
        allUsers: []
      });
});

router.post('/', async (req, res) => {
    return res.send(req.body);
});

router.get('/:range', async (req, res) => {
    return res.send({});
});


router.delete('/', async (req, res) => {
  return res.send({
    poppedUser: user
  });
});

module.exports = router;
