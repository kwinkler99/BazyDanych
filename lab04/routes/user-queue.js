const express = require('express');
const { info } = require('../config/redisClient');
const router = express.Router();
const client = require('../config/redisClient');

router.get('/', async (req, res) => {
  const result = await client.zrange('user-queue', 0, -1)
    return res.send(result);
});

router.post('/', async (req, res) => {
  const index = await client.zrange('user-queue', 0, -1)
  const name = req.body.name
  await client.zadd('user-queue', index.length + 1, name)
  
  return res.send("Dodano");
});

router.get('/:range', async (req, res) => {
  const range = req.params.range;
  const result = await client.zrangebyscore('user-queue', 1, range)
  return res.send(result);
});


router.delete('/', async (req, res) => {
  const person = await client.zrange('user-queue', 0, -1)
  await client.zremrangebyrank('user-queue', 0, 0)
  return res.send({
    poppedUser: person[0]
  });
});

module.exports = router;


/*
router.get('/', async (req, res) => {
  try {
    const allUsers = await client.lrange('user-queue', 0, -1);
    return res.send(allUsers);
  } catch (error) {
    { res.send({ error }) };
  }
});

router.post('/', async (req, res) => {
  try {
    const newUser = req.body.user;
    await client.rpush('user-queue', newUser);
    return res.send({ newUser: newUser});
  } catch (error) {
    { res.send({ error }) };
  }
});

router.get('/:range', async (req, res) => {
  try {
    const stopAt = req.params.range;
    const usersTo = await client.lrange('user-queue', 0, stopAt);
    return res.send(usersTo);
  } catch (error) {
    { res.send({ error }) };
  }
});

router.delete('/', async (req, res) => {
  try {
    const deletedUser = await client.lpop('user-queue');
    return res.send({ deletedUser: deletedUser });
  } catch (error) {
    { res.send({ error }) };
  }
});
*/