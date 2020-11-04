const express = require('express');
const { Types } = require('mongoose');
const router = express.Router();
const User = require('../models/User');


router.get('/:id', async (req, res) => {
    const id = req.params.id
    const users = await User.aggregate()
        .match(
          { 
            _id: Types.ObjectId(id)
          })
        .group({
            _id: null, email: {$first: '$email'}, posts: { $first: '$posts'.length}
        })
        

    
      return res.send(users);

})

module.exports = router;