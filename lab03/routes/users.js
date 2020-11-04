const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/', async (req, res) => {
  const users = await User.find().populate('posts');
    return res.send(users);
});

router.post('/', async (req, res) => {
  const users = new User({
    ...req.body
  })

  const insertedUser = await users.save();

  return res.send(insertedUser);
});

router.get('/:idUser', async (req, res) => {
    return res.send({});
});

router.put('/:idUser', async (req, res) => {
    const id = req.params.idUser;
    return res.send({
      putUserId: id
    });
});

router.delete('/:idUser', async (req, res) => {
  const id = req.params.idUser;
  return res.send({
    deletedUserId: id
  });
});

router.patch('/:idUser', async (req, res) => {
    const id = req.params.idUser;
    return res.send({
      patchUserId: id
    });
});


module.exports = router;
