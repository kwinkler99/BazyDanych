const express = require('express');
const router = express.Router({mergeParams: true});
const driver = require('../config/neo4jDriver');

router.get('/', async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run("MATCH (m:Movie) RETURN m as title"));
            
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

    try {
        const result = await session.readTransaction((tx) =>
            tx.run('MATCH (m:Movie) WHERE ID(m)=\$id\ RETURN m as title',
            {
              id: id
            }));
            
        session.close()
        const respond = result.records.map(record => {
            return record.get('title');
        });
        return res.send(respond);
    } catch(ex) {
        res.send(ex);
    }
});


router.post('/', async (req, res) => {
    const { title, releaseYear, genre } = req.body
    const session = driver.session();
    try {
        await session.writeTransaction((tx) =>
            tx.run("MERGE (m:Movie {title: \$title\, releaseYear: \$releaseYear\, genre: \$genre\}) RETURN m", 
            {
                title: title,
                releaseYear: releaseYear,
                genre, genre
            }));
            
        session.close();
        return res.send({
            'title': title,
            'releaseYear': releaseYear,
            'genre': genre
        });
    } catch(ex) {
        res.send(ex);
    }
});

router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const { title, releaseYear, genre } = req.body;
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run('MATCH (m:Movie) WHERE ID(m)=\$id\ SET m.title=\$title\, m.releaseYear=\$releaseYear\, m.genre=\$genre\ RETURN m as title', 
            {
                id: id,
                title: title,
                releaseYear: releaseYear,
                genre, genre
            }));
            
        session.close();
        const respond = result.records.map(record => {
            return record.get('title');
        });
        return res.send(respond);
    } catch(ex) {
        res.send(ex);
    }
});

router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id)
    const session = driver.session();
    try {
        await session.writeTransaction((tx) =>
            tx.run('MATCH (m:Movie) WHERE ID(m)=\$id\ DETACH DELETE m', 
            {
                id: id
            }));
            
        session.close();
        return res.send({
            'deleteId': id
        });
    } catch(ex) {
        res.send(ex);
    }
});

router.post('/assign-actor', async (req, res) => {
    const id_actor = parseInt(req.body.id_actor);
    const id_movie = parseInt(req.body.id_movie);
    const session = driver.session();
    try {
        const result = await session.writeTransaction((tx) =>
            tx.run('MATCH (a:Actor) WHERE ID(a)=\$id_actor\ MATCH (m:Movie) WHERE ID(m)=\$id_movie\ CREATE (a)-[rel: ACTED_IN]->(m) RETURN a,rel,m', 
            {
                id_actor: id_actor,
                id_movie: id_movie
            }));
            
        session.close();
        const respond = result.records.map(record => {
            return record.get('rel');
        });
        return res.send(respond);
    } catch(ex) {
        res.send(ex);
    }
});

router.get('/:id/actors', async (req, res) => {
    const id_movie = parseInt(req.params.id);
    const session = driver.session();
    const result = [];

    await session
        .run('MATCH (m:Movie) WHERE ID(m)=\$id_movie\ MATCH (m)-[rel: ACTED_IN]-(a:Actor) RETURN a,rel,m',
        {
          id_movie:id_movie
        })
        .subscribe({
          onKeys: keys => {
            console.log(keys)
          },
          onNext: record => {
            result.push(record.get('a'));
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


router.get('/:id/distinct-actors', async (req, res) => {
    const id_movie = parseInt(req.params.id);
    const session = driver.session();
    const result = [];

    await session
        .run('MATCH (m:Movie) WHERE ID(m)=\$id_movie\ MATCH (m)-[rel: ACTED_IN]-(a: Actor) WHERE SIZE((a)-[:ACTED_IN]-()) = 1 RETURN a',
        {
          id_movie: id_movie
        })
        .subscribe({
          onKeys: keys => {
            console.log(keys)
          },
          onNext: record => {
            result.push(record.get('a'));
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

router.get('/:id/actors/:idActor', async (req, res) => {
    const session = driver.session();
    const id = parseInt(req.params.id);
    const idActor = parseInt(req.params.idActor)

    try {
        const result = await session.readTransaction((tx) =>
            tx.run('MATCH (m:Movie) WHERE ID(m)=\$id\ MATCH (m)-[rel: ACTED_IN]-(a:Actor) WHERE NOT ID(a)=\$idActor\ MATCH (b: Actor) WHERE ID(b)=\$idActor\ MATCH (a)-[:IS_FRIEND_WITH]-(b) RETURN a as title',
            {
              id: id,
              idActor: idActor
            }));
            
        session.close()
        const respond = result.records.map(record => {
            return record.get('title');
        });
        return res.send(respond);
    } catch(ex) {
        res.send(ex);
    }
});

module.exports = router;
