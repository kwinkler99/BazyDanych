const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { Types } = require('mongoose');
const Post = require('../models/Post');




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
  const id = req.params.idUser;
  if(id === "registration-raport"){
    const date = req.query.date
    const users = await User.aggregate()
      .match(
        { 
          registrationDate: {$gt: new Date(date)} 
        })
      .group( 
        { 
          _id: "$registrationDate", 
          date: {$first: '$registrationDate'},  
          count: { $sum: 1 } 
        })
      .project( { _id: 0 } )
  
    return res.send(users);
  }
  else{
    User.find({"_id" : id}, function (err, result) {
      if (err) return console.error(err);
      return res.send(result);
    })
  }
})


router.put('/:idUser', async (req, res) => {
  const id = req.params.idUser;

  User.replaceOne(id, {...req.body})
    .then((r) => res.send(r))
    .catch(error => res.send({error: error.message}))
});


router.delete('/:idUser', async (req, res) => {
  const id = req.params.idUser;

  //usuwanie postow usera
  const user = await User.findById(id);
  const posts = await user['posts']; 
  for (let index = 0; index < posts.length; index++) {
    await Post.findByIdAndDelete(posts[index]);
  }

  User.findByIdAndDelete(id)
  .then((r) => res.send(r))
  .catch(error => res.send({error: error.message}))
});


router.patch('/:idUser', async (req, res) => {
  const id = req.params.idUser;

  User.findById(id, req.body, {new: true})
    .then((r) => res.send(r))
    .catch(error => res.send({error: error.message}))
});


module.exports = router;
