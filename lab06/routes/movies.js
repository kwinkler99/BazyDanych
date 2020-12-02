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
