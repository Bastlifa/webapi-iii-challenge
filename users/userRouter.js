const express = require('express')
const userDB = require('./userDb')

const router = express.Router();

router.use(express.json())

router.post('/', (req, res) => {
    
});

router.post('/:id/posts', (req, res) => {

});

router.get('/', (req, res) => {
    userDB.get()
        .then(response =>
            {
                res.status(200).json(response)
            })
        .catch(err =>
            {
                res.status(500).json({ errorMessage: 'there was an error trying to retrieve users', error: err })
            })
});

router.get('/:id', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

const validateUserID = (req, res, next) =>
{
    const id = req.id
    if(userDB.getById(Number(id))) next()
    else res.status(400).json({ message: 'Invalid user id' })
}

const validateUser = (req, res, next) =>
{
    if(!req.body) res.status(400).json({ message: "missing user data" })
    else if(!req.body.name) res.status(400).json({ message: "missing required name field" })
    next()
}

function validatePost(req, res, next) {
    if(!req.body) res.status(400).json({ message: "missing post data" })
    else if(!req.body.text) res.status(400).json({ message: "missing required text field" })
    next()
};

module.exports = router;
