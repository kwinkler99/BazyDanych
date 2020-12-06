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
    const { name, age, company } = req.body;

    await session
        .run('MERGE (a:Actor {name : \$name\, age: \$age\, company: \$company\}) RETURN a',
        {
          name: name,
          age: age,
          company: company
        })
        .subscribe({
          onKeys: keys => {
            console.log(keys)
          },
          onNext: record => {
            console.log(record.get('a'))
          },
          onCompleted: () => {
            session.close();
            return res.send({
              'name': name,
              'age': age,
              'compaany': company
            });
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
