const express = require('express');
const router = express.Router();

const User = require('../models/User');

router.get('/', async (req, res) => {
  User.find(function (err, result) {
    if (err) return console.error(err);
    return res.send(result);
  })
});

router.post('/', async (req, res) => {
  const data = req.body;
  const user = new User({
    login: data.login,
    email: data.email,
    registrationDate: Date.now()
  });
  user.save(function (err,result) {
    if(err){
        return res.send({
          error: err
        });
    }
    return res.send(result);
  })
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  User.find({"_id" : id}, function (err, result) {
    if (err) return console.error(err);
    return res.send(result);
  })
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const data = req.body
    User.updateOne({"_id" : id}, 
      {$set:{'login': data.login, 'email': data.email}},
      function (err, result) {
        if (err) return console.error(err);
        return res.send({
          putUserId: id
        });
      })
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  User.deleteOne({"_id": id}, function(err, result) {
    if (err) return console.error(err);
    return res.send({
      deletedUserId: id
    });
  })
});

router.patch('/:id', async (req, res) => {
  const id = req.params.id;
  User.findByIdAndUpdate({"_id": id},
    req.body,
    {new: true},
    function(err, result){
      if (err) return console.error(err);
      return res.send({
        patchUserId: id
      });
    })
});

module.exports = router;


/*
//LUB
//GET --------------------------------------
User.findById(req.params.id)
  .then((r) => res.send(r))
  .catch(error => res.send({error: error.message}))
  
//PUT --------------------------------------
const id = req.params.id;
User.replaceOne(id, {...req.body})
  .then((r) => res.send(r))
  .catch(error => res.send({error: error.message}))

//DELETE --------------------------------------
const id = req.params.id;
User.findByIdAndDelete(id)
  .then((r) => res.send(r))
  .catch(error => res.send({error: error.message}))

//PATCH --------------------------------------
const id = req.params.id;
User.findById(id, req.body, {new: true})
  .then((r) => res.send(r))
  .catch(error => res.send({error: error.message}))
  */