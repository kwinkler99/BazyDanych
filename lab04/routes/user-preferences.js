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
  const key = req.params.key
  const ex = req.body.ex
  const value = req.body.value
  const elem = await client.get(key)
  const result = value && ex ? 
    await client.set(id, value, "EX", ex, 'XX') : elem ?
    await client.set(key, value) :
    {error: "Error"};

  return res.send(result);
});

router.delete('/:key', async (req, res) => {
  const key = req.params.key;
  await client.del(key);

  return res.send({
    deleteElem: key
  });
});


module.exports = router;
/*
router.get('/', async (req, res) => {
  try {
    const allPreferences = await client.keys('user-preferences:*');
    return res.send(allPreferences);
  } catch (error) {
    { res.send({ error }) };
  }
});

router.get('/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const foundPreference = await client.get(`user-preferences:${key}`);
    return res.send(foundPreference);
  } catch (error) {
    { res.send({ error }) };
  }
});

router.post('/', async (req, res) => {
  try {
    const key = req.body.key;
    const value = req.body.value;
    const time = req.body.time;
    time ? await client.set(`user-preferences:${key}`, value, 'EX', time) : await client.set(`user-preferences:${key}`, value);
    return res.send({ 
      newPreferenceKey: key,
      newPreference: value });
  } catch (error) {
    { res.send({ error }) };
  }
});

router.put('/:key', async (req, res) => {
  try {
    const key = req.params.key;
    const value = req.body.value;
    const time = req.body.time;
    time ? await client.set(`user-preferences:${key}`, value, 'EX', time, 'XX') : await client.set(`user-preferences:${key}`, value, 'XX');
    return res.send({ updatedPreference: key });
  } catch (error) {
    { res.send({ error }) };
  }
});

router.delete('/:key', async (req, res) => {
  try {
    const key = req.params.key;
    await client.del(`user-preferences:${key}`);
    return res.send({ deletedPreference: key });
  } catch (error) {
    { res.send({ error }) };
  }
});
*/