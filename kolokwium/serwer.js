const express = require('express');
const router = express.Router({mergeParams: true});
const driver = require('./bazaNeo4j');

router.get('/przodkowie/:n', async (req, res) => {
    const session = driver.session();
    const n = req.params.n
    const result = []
    await session
      .run('MATCH (p: Person) WHERE SIZE((p)-[:Father]->()) = 0 AND SIZE((p)-[:Mother]->()) = 0 FOREACH (n IN \$n\ | MATCH (p)-[:Father]-(p1:Person) MATCH (p)-[:Mother]-(p2:Person)) RETURN p1, p2')
      .subscribe({
        onKeys: keys => {
          console.log(keys);
        },
        onNext: record => {
          result.push(record.get('p1'))
          result.push(record.get('p2'))
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


router.get('/kuzyni/:id', async (req, res) => {
    const session = driver.session();
    const id = parseInt(req.params.id);
    const result = [];

    await session
      .run('MATCH (p: Person) WHERE ID(a)=\$id\ MATCH (p)-[:Mother]-(p2:Person) MATCH (p2)-[:Mother]-(p3:Person) WHERE NOT ID(p3)=\$id\ MATCH (p)-[:Father]-(p4:Person) MATCH (p4)-[:Father]-(p5:Person) WHERE NOT ID(p5)=\$id\ RETURN p3, p5',
      {
        id: id
      })
      .subscribe({
        onKeys: keys => {
          console.log(keys);
        },
        onNext: record => {
          result.push(record.get('p3'));
          result.push(record.get('p5'));
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

router.get('/osoby', async (req, res) => {
    const session = driver.session();
    const result = [];

    await session
      .run('MATCH (p: Person) MATCH (p)-[:Father]-(p2:Person) MATCH (p2)-[:Father]-(p3:Person) WHERE SIZE((p3)-[:Father]->()) > 1 MATCH (p)-[:Father]-(p4:Person) MATCH (p4)-[:Mother]-(p5:Person) WHERE SIZE((p5)-[:Father]->()) > 1 MATCH (p)-[:Mother]-(p6:Person) MATCH (p6)-[:Father]-(p7:Person) WHERE SIZE((p7)-[:Father]->()) = 1 MATCH (p)-[:Mother]-(p8:Person) MATCH (p8)-[:Mother]-(p9:Person) WHERE SIZE((p9)-[:Mother]->()) = 1 RETURN p',
      {
        id: id
      })
      .subscribe({
        onKeys: keys => {
          console.log(keys);
        },
        onNext: record => {
          result.push(record.get('p'));
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

router.get('/max', async (req, res) => {
    const session = driver.session();
    const result = [];

    await session
      .run('MATCH (p:Person) MATCH (p)-[:Mother]-(p1:Person) MATCH (p1)-[:Mother]->(p2:Person) RETURN p2,p ORDER BY DESC LIMIT 1',
      {
        id: id
      })
      .subscribe({
        onKeys: keys => {
          console.log(keys);
        },
        onNext: record => {
          result.push(record.get('p2'));
          result.push(record.get('p'))
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
