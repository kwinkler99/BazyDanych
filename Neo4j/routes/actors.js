const express = require('express');
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

router.get('/popular', async (req, res) => {
  const session = driver.session();
  try {
      const result = await session.readTransaction((tx) =>
          tx.run("MATCH (a:Actor) RETURN a as title ORDER BY SIZE((a)-[:ACTED_IN]-()) DESC LIMIT 3"));
          
      session.close();
      const respond = result.records.map(record => {
          return record.get('title');
      });
      return res.send(respond);
  } catch(ex) {
      res.send(ex);
  }
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

router.put('/:id', async (req, res) => {
    const session = driver.session();
    const { name, age, company } = req.body;
    const id = parseInt(req.params.id);

    await session
      .run('MATCH (a:Actor) WHERE ID(a)=\$id\ SET a.name=\$name\, a.age=\$age\, a.company=\$company\ RETURN a',
      {
        id: id,
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

router.delete('/:id', async (req, res) => {
  const session = driver.session();
  const id = parseInt(req.params.id);

  await session
    .run('MATCH (a:Actor) WHERE ID(a)=\$id\ DETACH DELETE a',
    {
      id: id,
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
          'deleteId': id
        });
      },
      onError: error => {
        console.log(error)
      }
    })
});

router.get('/:id/friend/:idFriend', async (req, res) => {
  const id = parseInt(req.params.id);
  const idFriend = parseInt(req.params.idFriend);
  const session = driver.session();
  const result = [];

  await session
      .run('MATCH (a:Actor) WHERE ID(a)=\$id\ MATCH (b:Actor) WHERE ID(b)=\$idFriend\ CREATE (a)-[rel: IS_FRIEND_WITH]->(b) RETURN rel',
      {
        id: id,
        idFriend: idFriend
      })
      .subscribe({
        onKeys: keys => {
          console.log(keys)
        },
        onNext: record => {
          result.push(record.get('rel'));
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

module.exports = router;
