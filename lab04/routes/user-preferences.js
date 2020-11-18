const express = require('express');
const router = express.Router({mergeParams: true});
const client = require('../config/redisClient');

router.get('/', async (req, res) => {
  const allKeys = await client.keys("*", (err, result) => {
    if (err) return res.sendStatus(400)
    return result
  })
  return res.send({
    all: allKeys
  })
});

router.get('/:key', async (req, res) => {
  const key = req.params.key
  const value = await client.get(key, (err, result) => {
    if (err) return res.sendStatus(400)
    return result
  })
  return res.send({
    'value': value
  })
});

router.post('/', async (req, res) => {
  const key = req.body.key;
  const value = req.body.value;
  const result = req.body.ex ? await client.set(key, value, "EX", req.body.ex) : await client.set(key, value);

  return res.send(result);
});

router.put('/:key', async (req, res) => {
  const key = req.params.key;
  const result = req.body.ex ? await client.set(key, value, "EX", req.body.ex) : await client.set(key, value);

  return res.send({
    updatedPreference: key
  });
});

router.delete('/:key', async (req, res) => {
  const key = req.params.key;
  const result = await client.del(key);

  return res.send(result);
});


module.exports = router;
