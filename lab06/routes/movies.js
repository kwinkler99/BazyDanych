const express = require('express');
const router = express.Router({mergeParams: true});
const driver = require('../config/neo4jDriver');

router.get('/', async (req, res) => {
    const session = driver.session();
    try {
        const result = await session.readTransaction((tx) =>
            tx.run("MATCH (m:Movie) RETURN m.title as title"));
            
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
    return res.send({});
});


router.post('/', async (req, res) => {
    const { title, releaseYear, genre } = req.body
    const session = driver.session();
    try {
        await session.writeTransaction((tx) =>
            tx.run("MERGE (m:Movie {title : \$title\, releaseYear: \$releaseYear\, genre: \$genre\}) RETURN m", 
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

router.put('/', async (req, res) => {
    return res.send({});
});

router.delete('/', async (req, res) => {
    return res.send({});
});

router.post('/assign-actor', async (req, res) => {
    return res.send({});
});

module.exports = router;
