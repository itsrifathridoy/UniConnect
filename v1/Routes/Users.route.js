const express = require('express');
const router = express.Router();
const Users = require('../Models/User.model')


router.get('/', async (req, res, next) => {  
    console.log(req.body);
    if (req.body && Object.keys(req.body).length > 0)
    {
        const result = await Users.getWithFilter(req.body);
        if(result.message) res.status(500)
        return res.send(result);
    }
    req.query.page = (req.query.page && parseInt(req.query.page)) || 1;
    req.query.limit = (req.query.limit && parseInt(req.query.limit)) || 10;
    res.send( await Users.getMultiple(req.query.page, req.query.limit));
});

router.get('/:id', async (req, res, next) => { 
    res.send(await Users.get(req.params.id));
})
router.put('/:id', async (req, res, next) => {
    const result = await Users.update(req.params.id, req.body);
    if(!result.success) res.status(500)
    res.send(result);
});

router.delete('/:id', async (req, res, next) => {

    const result = await Users.deleteUser(req.params.id);
    if(!result.success) res.status(500)
    res.send(result);
});






module.exports = router;