const express = require('express');
const router = express.Router({mergeParams: true});

const User = require('../models/User')
const Post = require('../models/Post');


router.get('/', async (req, res) => {
  return res.send({});
});

router.get('/:id', async (req, res) => {
    return res.send({});
});

router.post('/', async (req, res) => {
  const post = new Post({
    ...req.body,
    author:req.params.id,
  })
  const createPost = await post.save();

  await User.findByIdAndUpdate(req.params.id,
    {'$push': {'posts': createPost._id}},
    {'new': true});

  return res.send(createPost);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  return res.send({
    deletedUserId: id
  });
});


module.exports = router;
