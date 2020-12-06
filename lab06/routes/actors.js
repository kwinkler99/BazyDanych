const express = require('express');
const { session } = require('../config/neo4jDriver');
const router = express.Router({mergeParams: true});
const driver = require('../config/neo4jDriver');

router.get('/', async (req, res) => {
    const session = driver.session();
    const result = []
    await session
      .run('MATCH (a:Actor) RETURN a')
      .subscribe({
        onKeys: keys => {
          console.log(keys);
        },
        onNext: record => {
          result.push(record.get('a'))
        },
        onCompleted: () => {
          session.close();
          return res.send(result)
        },
        onError: error => {
          console.log(error)
        }
      })
});

router.get('/:id', async (req, res) => {
    const session = driver.session();
    const id = parseInt(req.params.id);
    const result = {};

    await session
      .run('MATCH (a:Actor) WHERE ID(a)=\$id\ RETURN a',
      {
        id: id
      })
      .subscribe({
        onKeys: keys => {
          console.log(keys);
        },
        onNext: record => {
          result['choose'] = record.get('a');
        },
        onCompleted: () => {
          session.close();
          return res.send(result['choose'])
        },
        onError: error => {
          console.log(error)
        }
      })
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
