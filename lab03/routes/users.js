const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/', async (req, res) => {
  const users = await User.find().populate('posts');

  return res.send(users);
});

router.post('/', async (req, res) => {
  const users = new User({
    ...req.body,
    registrationDate: Date.now()
  })

  const insertedUser = await users.save();

  return res.send(insertedUser);
});

// router.get('/:idUser', async (req, res) => {
//   const id = req.params.idUser;
//   User.find({"_id" : id}, function (err, result) {
//     if (err) return console.error(err);
//     return res.send(result);
//   })
// })


router.get('/registration-raport', async (req, res) => {
  const date = req.query.date
  
  const users = await User.aggregate([
    {$match: { registrationDate: {$gte: new Date(date)} } },
    { $group: { "_id": "$_id", date: {"$first": "$registrationDate"}, count: { $sum: 1 } } }
  ])

  return res.send(users);
});


router.put('/:idUser', async (req, res) => {
  const id = req.params.idUser;

  User.replaceOne(id, {...req.body})
    .then((r) => res.send(r))
    .catch(error => res.send({error: error.message}))
});

router.delete('/:idUser', async (req, res) => {
  const id = req.params.idUser;

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
