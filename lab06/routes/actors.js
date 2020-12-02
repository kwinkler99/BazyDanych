const express = require('express');
const router = express.Router({mergeParams: true});
const driver = require('../config/neo4jDriver');

router.get('/', async (req, res) => {
    return res.send({});
});

router.get('/:id', async (req, res) => {
    return res.send({});
});


router.post('/', async (req, res) => {
    const session = driver.session();
    await session
        .run('MERGE (a:Actor {name : \'Arnold\'}) RETURN a.name')
        .subscribe({
          onKeys: keys => {
            console.log(keys)
          },
          onNext: record => {
            console.log(record.get('a.name'))
          },
          onCompleted: () => {
            session.close();
            return res.send({});
          },
          onError: error => {
            console.log(error)
          }
        })
});

router.put('/', async (req, res) => {
    return res.send({});
});

router.delete('/', async (req, res) => {
    return res.send({});
});

module.exports = router;
