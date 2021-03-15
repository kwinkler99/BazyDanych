const express = require('express');
const router = express.Router();
const Post = require('../models/Post');


router.get('/summary', async(req, res) => {
    const summary  = await Post.aggregate()
        .group(
            {
                _id: 'null',
                average: {$avg: '$responses'},
                sum: {$sum: '$responses'},
                min: {$min: '$responses'},
                max: {$max: '$responses'}
            }
        )
        .project({
            _id: 0,
        });
    return res.send(summary);
})


module.exports = router;
