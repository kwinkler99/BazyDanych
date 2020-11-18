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
    return res.send({
      'msg': 'get key'
    });
});

router.post('/', async (req, res) => {
    return res.send(req.body);
});

router.put('/:key', async (req, res) => {
  const key = req.params.key;
  return res.send({
    updatedPreference: key
  });
});

router.delete('/:key', async (req, res) => {
  const key = req.params.key;
  return res.send({
    deletedPreference: key
  });
});


module.exports = router;
