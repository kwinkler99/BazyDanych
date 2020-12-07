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

router.delete('/', async (req, res) => {
    return res.send({});
});

router.post('/assign-actor', async (req, res) => {
    return res.send({});
});

module.exports = router;
