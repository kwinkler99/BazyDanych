const express = require('express');
const router = express.Router({mergeParams: true});
const { Types } = require('mongoose');

const User = require('../models/User')
const Post = require('../models/Post');


router.get('/', async (req, res) => {
  const id = req.params.id
  Post.find({"author" : id}, function (err, result) {
    if (err) return console.error(err);
    return res.send(result);
  })
});


router.get('/:idPost', async (req, res) => {
  const id = req.params.id
  const idPost = req.params.idPost
  if(idPost === "summary"){
    const users = await User.aggregate()
    .match(
      { 
        _id: Types.ObjectId(id)
      })
      .unwind('$posts')
      .group(
          {
              _id: '$email',
              email: { $first: '$email' },
              posts: { $sum: 1 }
          }
      )
      .project({ _id: 0 });
  
    return res.send(users);
  }
  else{
    Post.findById({"author" : id, _id: idPost})
    .then((r) => res.send(r))
    .catch(error => res.send({error: error.message}))
  }
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


router.delete('/:idPost', async (req, res) => {
  const id = req.params.id;
  const idPost = req.params.idPost

  Post.findByIdAndDelete({"author": id, _id: idPost})
  .then((r) => res.send(r))
  .catch(error => res.send({error: error.message}))
});



module.exports = router;
